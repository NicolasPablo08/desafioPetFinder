import find from "lodash/find";
import "dotenv/config";
import { log } from "console";

const LOCAL_URL = process.env.LOCAL_URL;
type Pet = {
	petId: number;
	name: string;
	imgUrl: string;
	lat: number;
	lng: number;
	userEmail?: string;
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
		for (const cb of this.listeners) {
			cb();
		}
	},
	subscribe(callback: (any) => any) {
		this.listeners.push(callback);
	},
	//dar de alta el user (signUp)
	async createUser(email: string, password: string) {
		try {
			const res = await fetch(LOCAL_URL + "/auth", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});
			if (!res.ok) throw new Error("Error al crear usuario");
			const data = await res.json();
			if (data.message) return data.message;
			if (data.token) {
				const cb = this.getState();
				cb.user.token = data.token;
				cb.user.email = email;
				this.setState(cb);
				return "ok";
			}
		} catch (error) {
			console.log(error, "error al crear el usuario");
			throw error; // Lanza el error para manejarlo donde llames a createUser
		}
	},
	//logIn
	async logIn(email: string, password: string) {
		const cb = this.getState();
		try {
			const res = await fetch(LOCAL_URL + "/auth/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});
			if (!res.ok) throw new Error("Error de logIn");
			const data = await res.json();
			if (data.message) return data.message;
			cb.user.token = data.token;
			cb.user.email = email;
			this.setState(cb);
			this.getAllPetsUser(); //cargamos el state con todos los pets del user
			return "ok";
		} catch (error) {
			console.log(error, "error de conexion al loguearse");
			//throw error; // Lanza el error para manejarlo donde llames a createUser
		}
	},
	//seteamos nombre y localidad del user
	async setDatesUser(nombre: string, localidad: string) {
		const cb = this.getState();
		const token = cb.user.token;
		try {
			const res = await fetch(LOCAL_URL + "/me/mis-datos", {
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
			if (!res.ok) throw new Error("Error al guardar los datos");
			cb.user.name = nombre;
			cb.user.location = localidad;
			this.setState(cb);
			return "ok";
		} catch (error) {
			console.log(error, "error al guardar los datos");
			throw error;
		}
	},
	//cambio de password del user
	async setNewPassword(password: string) {
		const cb = this.getState();
		const token = cb.user.token;
		try {
			const res = await fetch(LOCAL_URL + "/me/mi-pass", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
				body: JSON.stringify({
					password,
				}),
			});
			if (!res.ok) throw new Error("Error al guardar los datos");
			const data = await res.json();
			cb.user.token = data.token;
			this.setState(cb);
			return "ok";
		} catch (error) {
			console.log(error, "error al guardar los datos");
			throw error;
		}
	},
	//obtener todos los pets de un user desde la bd, lo llamamos luego de login
	async getAllPetsUser() {
		const cb = this.getState();
		const token = cb.user.token;
		try {
			const res = await fetch(LOCAL_URL + "/me/my-pets", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
			});
			const data = await res.json();
			const pets = data.map((pet) => ({
				petId: pet.id,
				name: pet.name,
				lat: pet.lat,
				lng: pet.lng,
				imgUrl: pet.imageUrl,
			}));
			cb.petsUser = pets;
			this.setState(cb);
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
		//console.log(name, imageUrl, location);
		try {
			const respuesta = await fetch(LOCAL_URL + "/me/my-pets", {
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
			if (!respuesta.ok)
				throw new Error("Error al crear el reporte de la mascota");
			const data = await respuesta.json(); //asi devuelve la respuesta el metodo http
			const newPetUser = {
				petId: data.id,
				name: data.name,
				imgUrl: data.imageUrl,
				lat: data.lat,
				lng: data.lng,
			};
			cb.petsUser.push(newPetUser);
			this.setState(cb);

			return "ok";
		} catch (error) {
			console.log(error, "error al crear el reporte de la mascota");
			throw error;
		}
	},
	//editar reporte de una mascota vinculada a un user//aca
	async editPetReport(
		name?: string,
		imageUrl?: string,
		lat?: number,
		lng?: number,
		petId?: number
	) {
		const cb = this.getState();
		const token = cb.user.token;
		try {
			const respuesta = await fetch(LOCAL_URL + "/me/my-pets/" + petId, {
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
			if (!respuesta.ok)
				throw new Error("Error al crear el reporte de la mascota");
			const data = await respuesta.json(); //asi devuelve la respuesta el metodo http
			const petToEdit = find(cb.petsUser, { petId: data.id }); //buscamos el pet que queremos editar con lodash
			if (petToEdit) {
				petToEdit.petId = data.id; //actualizamos el id por si cambio
				petToEdit.name = data.name;
				petToEdit.imgUrl = data.imageUrl;
				petToEdit.lat = data.lat;
				petToEdit.lng = data.lng;

				// Actualizar el estado
				this.setState({
					...cb,
					petsUser: cb.petsUser.map(
						(pet) => (pet.petId === petToEdit.petId ? petToEdit : pet) // Reemplazar la mascota editada
					),
				});
				return "ok";
			} else {
				console.log("Mascota no encontrada en el state para editar");
			}
			this.setState(cb);
		} catch (error) {
			console.log(error, "error al editar el reporte de la mascota");
			throw error;
		}
	},

	//eliminar definitivamente el reporte de una mascota de un usuario
	async deletePetReport(petId: number) {
		const cb = this.getState();
		const token = cb.user.token;
		try {
			const respuesta = await fetch(LOCAL_URL + "/me/my-pets/" + petId, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
			});
			if (!respuesta.ok)
				throw new Error("Error al crear el reporte de la mascota");
			const data = await respuesta.json(); //asi devuelve la respuesta el metodo http
			if (data.delete) {
				cb.petsUser = cb.petsUser.filter((pet) => pet.petId !== petId);
				this.setState(cb);
				return "ok";
			} else {
				console.log("Mascota no encontrada en el state para eliminar");
			}
		} catch (error) {
			console.error("Error en deletePetReport:", error);
			throw error;
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
			const respuesta = await fetch(
				LOCAL_URL +
					"/search-pets?lat=" +
					lat +
					"&lng=" +
					lng +
					"&rango=" +
					rango
			);
			const data = await respuesta.json();
			// console.log(data);

			const searchPets = data.map((pet) => ({
				petId: pet.id,
				name: pet.name,
				imgUrl: pet.imageUrl,
				lat: pet.lat,
				lng: pet.lng,
				userEmail: pet["User.email"] || null, //si usamos raw:true en el controller (limpia el objeto resultado), obtenemos el mail asi, si no utilizamos raw: true, accedemos con pet.User.email
			}));
			cb.allPetsLost = searchPets;
			this.setState(cb);
			return "ok";
		} catch (error) {
			console.error(
				"Error en al realizar las busqueda con el metodo searchPetsNearby:",
				error
			);
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
			const respuesta = await fetch(LOCAL_URL + "/send-email", {
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
			const data = await respuesta.json();
			return data;
		} catch (error) {
			console.error("Error al enviar el email", error);
		}
	},
	//chequear si estamos logueados o no
	checkLogin() {
		const token = this.getState().user.token;
		if (token) {
			return true;
		} else {
			this.logOut();
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
	},
};
