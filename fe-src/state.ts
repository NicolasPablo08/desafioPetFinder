import find from "lodash/find";
import "dotenv/config";
import { Router } from "@vaadin/router";
import { getCiudadProvincia } from "./lib/map";

const LOCAL_URL = process.env.LOCAL_URL;
type Pet = {
	petId: number;
	name: string;
	imgUrl: string;
	lat: number;
	lng: number;
	userEmail?: string;
	ubicacion?: string;
};

export const state = {
	data: {
		user: {
			name: "",
			email: "",
			location: "",
			token: "",
		},
		petsUser: [] as Pet[],
		allPetsLost: [] as Pet[],
	},
	listeners: [],
	getState() {
		return this.data;
	},
	setState(newState) {
		this.data = newState;
		sessionStorage.setItem("userStatePetFinder", JSON.stringify(newState.user));
		for (const cb of this.listeners) {
			cb();
		}
	},
	subscribe(callback: (any) => any) {
		this.listeners.push(callback);
	},

	// Inicializa el estado desde el localStorage
	init() {
		const storedUser = sessionStorage.getItem("userStatePetFinder");
		if (storedUser) {
			const userData = JSON.parse(storedUser);
			this.data.user = {
				...this.data.user,
				...userData,
			};
			// Cargar los pets del usuario si es necesario
			//this.getAllPetsUser();
		}
	},
	//dar de alta el user (signUp)
	async createUser(email: string, password: string) {
		const cb = this.getState();
		try {
			const response = await fetch(LOCAL_URL + "/auth", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});
			const data = await response.json();
			if (data.status === "success") {
				cb.user.token = data.token;
				cb.user.email = email;
				this.setState(cb);
			}
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el metodo createUser del state", error);
			return { status: "error" };
		}
	},
	//logIn
	async logIn(email: string, password: string) {
		const cb = this.getState();
		try {
			const response = await fetch(LOCAL_URL + "/auth/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});
			const data = await response.json();
			if (data.status === "success") {
				cb.user.token = data.token;
				cb.user.email = email;
				cb.user.name = data.name || "";
				cb.user.location = data.localidad || "";
				this.setState(cb);
				await this.getAllPetsUser(); //cargamos el state con todos los pets del user
			}
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el metodo logIn del state", error);
			return { status: "error" };
		}
	},
	//seteamos nombre y localidad del user
	async setDatesUser(nombre: string, localidad: string) {
		const cb = this.getState();
		const token = cb.user.token;
		try {
			const response = await fetch(LOCAL_URL + "/me/my-data", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
				body: JSON.stringify({
					name: nombre,
					location: localidad,
				}),
			});
			const data = await response.json();
			if (data.status === "success") {
				cb.user.name = nombre;
				cb.user.location = localidad;
				this.setState(cb);
			}
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el metodo setDatesUser del state", error);
			return { status: "error" };
		}
	},
	//cambio de password del user
	async setNewPassword(password: string) {
		const cb = this.getState();
		const token = cb.user.token;
		try {
			const response = await fetch(LOCAL_URL + "/me/my-pass", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
				body: JSON.stringify({
					password,
				}),
			});
			const data = await response.json();
			if (data.status === "success") {
				cb.user.token = data.token;
				this.setState(cb);
			}
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el metodo setNewPassword del state", error);
			return { status: "error" };
		}
	},
	//obtener todos los pets de un user desde la bd, lo llamamos luego de login
	async getAllPetsUser() {
		const cb = this.getState();
		const token = cb.user.token;
		try {
			const response = await fetch(LOCAL_URL + "/me/my-pets", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
			});
			const data = await response.json();
			if (data.status === "success") {
				const searchPets = await Promise.all(
					data.petsLost.map(async (pet) => {
						const ubicacion = await getCiudadProvincia(pet.lat, pet.lng);
						return {
							petId: pet.id,
							name: pet.name,
							lat: pet.lat,
							lng: pet.lng,
							imgUrl: pet.imageUrl,
							ubicacion, // agregamos la ubicación acá
						};
					})
				);
				cb.petsUser = searchPets;
				this.setState(cb);
			}
			return "ok";
		} catch (error) {
			console.error("Error en getAllPetsUser:", error);
		}
		return cb.petsUser;
	},

	//crear reporte de mascota perdida vinculada a un usuario
	async createPetReport(
		name: string,
		imageUrl: string,
		lat: number,
		lng: number
	) {
		const cb = this.getState();
		const token = cb.user.token;
		try {
			const response = await fetch(LOCAL_URL + "/me/my-pets", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
				body: JSON.stringify({
					name,
					imageUrl,
					lat,
					lng,
				}),
			});
			const data = await response.json(); //asi devuelve la respuesta el metodo http
			if (data.status === "success") {
				// Mapeamos y agregamos la ubicación con getCiudadProvincia
				const ubicacion = await getCiudadProvincia(
					data.newPetReport.lat,
					data.newPetReport.lng
				);
				const pet = {
					petId: data.newPetReport.id,
					name: data.newPetReport.name,
					lat: data.newPetReport.lat,
					lng: data.newPetReport.lng,
					imgUrl: data.newPetReport.imageUrl,
					ubicacion,
				};

				cb.petsUser.push(pet);
				this.setState(cb);
			}

			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el metodo createPetReport del state", error);
			return { status: "error" };
		}
	},
	//editar reporte de una mascota vinculada a un user//aca
	async editPetReport(
		name: string,
		imageUrl: string,
		lat: number,
		lng: number,
		petId: number
	) {
		const cb = this.getState();
		const token = cb.user.token;
		try {
			const response = await fetch(LOCAL_URL + "/me/my-pets/" + petId, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
				body: JSON.stringify({
					name,
					imageUrl,
					lat,
					lng,
				}),
			});
			const data = await response.json(); //asi devuelve la respuesta el metodo http
			if (data.status === "success") {
				const ubicacion = await getCiudadProvincia(
					data.reportPet.lat,
					data.reportPet.lng
				);
				const petToEdit = find(cb.petsUser, { petId: data.reportPet.id }); //buscamos el pet que queremos editar con lodash
				if (petToEdit) {
					petToEdit.petId = data.reportPet.id; //actualizamos el id por si cambio
					petToEdit.name = data.reportPet.name;
					petToEdit.imgUrl = data.reportPet.imageUrl;
					petToEdit.lat = data.reportPet.lat;
					petToEdit.lng = data.reportPet.lng;
					petToEdit.ubicacion = ubicacion;
					// Actualizar el estado
					this.setState({
						...cb,
						petsUser: cb.petsUser.map(
							(pet) => (pet.petId === petToEdit.petId ? petToEdit : pet) // Reemplazar la mascota editada
						),
					});
				}
			}
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el metodo editPetReport del state", error);
			return { status: "error" };
		}
	},

	//eliminar definitivamente el reporte de una mascota de un usuario
	async deletePetReport(petId: number) {
		const cb = this.getState();
		const token = cb.user.token;
		try {
			const response = await fetch(LOCAL_URL + "/me/my-pets/" + petId, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
			});
			const data = await response.json(); //asi devuelve la respuesta el metodo http
			if (data.status === "success") {
				cb.petsUser = cb.petsUser.filter((pet) => pet.petId !== petId);
				this.setState(cb);
			}
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el metodo deletePetReport del state", error);
			return { status: "error" };
		}
	},

	//obtener una mascota del usuario desde el state, ya que para obtener todos podemos hacer un getState().petsUser
	getOneUserPet(petId: number) {
		const cb = this.getState();

		const pet = find(cb.petsUser, { petId });
		if (!pet) {
			throw new Error("Mascota no encontrada en el state");
		}
		return pet;
	},

	//buscamos todos los pets cercanos a una ubicacion
	async searchPetsNearby(lat: number, lng: number, rango: number) {
		const cb = this.getState();
		try {
			const response = await fetch(
				LOCAL_URL +
					"/search-pets?lat=" +
					lat +
					"&lng=" +
					lng +
					"&rango=" +
					rango
			);
			const data = await response.json();
			if (data.status === "success") {
				const searchPets = await Promise.all(
					data.pets.map(async (pet) => {
						const ubicacion = await getCiudadProvincia(pet.lat, pet.lng);
						return {
							petId: pet.id,
							name: pet.name,
							imgUrl: pet.imageUrl,
							lat: pet.lat,
							lng: pet.lng,
							userEmail: pet["User.email"] || null,
							ubicacion, // agregamos la ubicación acá
						};
					})
				);
				cb.allPetsLost = searchPets;
				this.setState(cb);
			}
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("Error en el metodo searchPetsNearby del state", error);
			return { status: "error" };
		}
	},
	//enviar email
	async sendEmail(
		nombre: string,
		email: string,
		telefono: string,
		informacion: string,
		namePet: string
	) {
		try {
			const response = await fetch(LOCAL_URL + "/send-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					nombre,
					email,
					telefono,
					informacion,
					namePet,
				}),
			});
			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error en el metodo sendEmail del state", error);
			return { status: "error" };
		}
	},
	//chequear si estamos logueados o no
	checkLogin() {
		const token = this.getState().user.token;
		if (token) {
			return true;
		} else {
			//this.logOut();
			return false;
		}
	},

	//Deslogueo
	logOut() {
		const initialState = {
			user: {
				name: "",
				email: "",
				location: "",
				token: "",
			},
			petsUser: [],
			allPetsLost: [],
		};
		this.setState(initialState);
		sessionStorage.removeItem("userStatePetFinder"); // Borra localStorage

		Router.go("/login");
	},
	//restablecer contraseña - obtener codigo de verificacion
	async getCode(email: string) {
		const cb = this.getState();
		try {
			const response = await fetch(LOCAL_URL + "/create-code", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});
			const data = await response.json();
			if (data.status === "success") {
				cb.user.email = email;
				this.setState(cb);
			}
			return data;
		} catch (error) {
			console.error("error en getCode del state", error);
			return { status: "error" };
		}
	},

	//restablecer contraseña - enviar codigo de verificacion y cambiar la pass
	async sendCode(codigo: string) {
		const cb = this.getState();
		try {
			const respuesta = await fetch(LOCAL_URL + "/compare-code", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ codigo, email: cb.user.email }),
			});
			const data = await respuesta.json();
			if (data.status === "success") {
				cb.user.token = data.token;
				this.setState(cb);
			}
			return { status: data.status, message: data.message };
		} catch (error) {
			console.error("error en sendCode del state", error);
			return { status: "error" };
		}
	},
};
