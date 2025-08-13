const LOCAL_URL = "http://localhost:3000";
//ver si es necesario agregar id al user y a newPet
export const state = {
	data: {
		user: {
			name: "",
			email: "",
			location: "",
			token: "",
		},
		newPet: {
			name: "",
			location: "",
			imageUrl: "",
		},
		petsUser: [],
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
	suscribe(callback: (any) => any) {
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

			cb.user.token = res;
			cb.user.email = email;
			this.setState(cb);
		} catch (error) {
			console.log(error, "error al crear el usuario");
			throw error; // Lanza el error para manejarlo donde llames a createUser
		}
	},
	//seteamos nombre y localidad del user
	async setDatesUser(name: string, location: string) {
		const cb = this.getState();
		const token = cb.user.token;
		cb.user.name = name;
		cb.user.location = location;
		this.setState(cb);
		try {
			const res = await fetch(LOCAL_URL + "/me/mis-datos", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
				body: JSON.stringify({
					name,
					location,
				}),
			});
			if (!res.ok) throw new Error("Error al guardar los datos");
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
			cb.user.token = res;
			this.setState(cb);
		} catch (error) {
			console.log(error, "error al guardar los datos");
			throw error;
		}
	},
	//crear reporte de mascota perdida vinculada a un usuario
	async createPetReport(name: string, imageUrl: string, location: string) {
		const cb = this.getState();
		const token = cb.user.token;
		cb.newPet.name = name;
		cb.newPet.imageUrl = imageUrl;
		cb.newPet.location = location;
		this.setState(cb);
		try {
			const res = await fetch(LOCAL_URL + "/me/my-pets", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Acá va el token
				},
				body: JSON.stringify({
					name,
					imageUrl,
					location,
				}),
			});
			if (!res.ok) throw new Error("Error al crear el reporte de la mascota");
		} catch (error) {
			console.log(error, "error al crear el reporte de la mascota");
			throw error;
		}
	},
};
