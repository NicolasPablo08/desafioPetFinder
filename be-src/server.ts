import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import * as cors from "cors";
import {
	createUser,
	loginUser,
	setNameAndLocalidad,
	setNewPassword,
	createReport,
	getPetsLostUser,
	editReport,
	getOnePetLostUser,
	deleteReport,
	SendEmail,
} from "./controllers/user-controller";
import "dotenv/config";
import { searchPets } from "./controllers/pet-controller";

console.log(process.env.SEQUELIZE_URL);

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.SERVER_PORT || 3000;

//creacion de nuevo usuario
app.post("/auth", async (req, res) => {
	if (!req.body.email || !req.body.password)
		return res
			.status(400)
			.send({ message: "falta el email o la contraseña para crear el perfil" });
	try {
		const newUser = await createUser(req.body.email, req.body.password);
		return res.json(newUser);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error al crear el usuario", error });
	}
});
//nos logueamos para obtener el token que guarda el id del user
app.post("/auth/token", async (req, res) => {
	if (!req.body.email || !req.body.password)
		return res
			.status(400)
			.send({ message: "falta el email o la contraseña para el logIn" });
	try {
		const tokenUser = await loginUser(req.body.email, req.body.password);
		res.json(tokenUser);
	} catch (error) {
		return res.status(401).json({ message: "Error al iniciar sesion", error });
	}
});

//frase secreta para la validacion del token que representa al usuario
const SECRET_KEY = process.env.SECRET_KEY || "estaEsLaFraseSecretaDelToken";
//middleware para obtener el id con el token
function authMiddleware(req, res, next) {
	const token = req.headers.authorization.split(" ")[1];
	try {
		const data = jwt.verify(token, SECRET_KEY);
		req._user = data;
		next();
	} catch (error) {
		res.status(401).json({ message: "Token no autorizado", error });
		console.error("Token no autorizado", error);
	}
}
// app.get("/me", authMiddleware, async (req, res) => {
// 	res.json(req._user);
// });

//para setear nombre y localidad
app.patch("/me/mis-datos", authMiddleware, async (req, res) => {
	if (!req.body.name || !req.body.location)
		return res.status(400).send({
			message: "falta el nombre o la localidad para cargar en el perfil",
		});
	if (!req._user)
		return res.status(401).json({ message: "Token no autorizado" });
	try {
		const user = await setNameAndLocalidad(
			req.body.name,
			req.body.location,
			req._user.id
		);
		return res.json(user);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error al cargar los datos", error });
	}
});

//para cambiar contraseña
app.patch("/me/mi-pass", authMiddleware, async (req, res) => {
	if (!req.body.newPassword)
		return res.status(400).send({
			message: "falta el password para cambiar en el perfil",
		});
	if (!req._user)
		return res.status(401).json({ message: "Token no autorizado" });
	try {
		const newToken = await setNewPassword(req.body.newPassword, req._user.id);
		return res.json(newToken);
	} catch (error) {
		return res
			.status(204)
			.json({ message: "Error al cambiar el password", error });
	}
});
//reportar nueva mascota perdida vinculada a un usuario
app.post("/me/my-pets", authMiddleware, async (req, res) => {
	if (!req.body.name || !req.body.lat || !req.body.lng || !req.body.imageUrl)
		throw new Error(
			"Falta el nombre, locacion o imagen de la mascota a reportar"
		);
	if (!req._user)
		return res.status(401).json({ message: "Token no autorizado" });
	try {
		const newReport = await createReport(
			req.body.name,
			req.body.lat,
			req.body.lng,
			req.body.imageUrl,
			req._user.id
		);
		return res.json(newReport);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error al crear el reporte de la mascota", error });
	}
});
//editar reporte de mascota perdida vinculada a un usuario
app.patch("/me/my-pets/:petId", authMiddleware, async (req, res) => {
	if (!req._user.id)
		return res.status(401).json({ message: "Token no autorizado" });

	if (!req.params.petId)
		return res.status(400).json({ message: "Falta el id del reporte" });

	try {
		const { name, imageUrl, lat, lng } = req.body;
		const reportEdit = await editReport(
			Number(req.params.petId),
			req._user.id,
			name,
			lat,
			lng,
			imageUrl
		);
		return res.json(reportEdit);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error al editar el reporte", error });
	}
});
//obtener las mascotas que siguen "lost" de un usuario,lo utilizo en el metodo "init" del state
app.get("/me/my-pets", authMiddleware, async (req, res) => {
	if (!req._user.id)
		return res.status(401).json({ message: "Token no autorizado" });
	try {
		const petsUser = await getPetsLostUser(req._user.id);
		return res.json(petsUser);
	} catch (error) {
		return res
			.status(204)
			.json({ message: "Error al obtener las mascotas perdidas", error });
	}
});
//obtener una mascota de un usuario
app.get("/me/my-pets/:reportId", authMiddleware, async (req, res) => {
	if (!req._user.id)
		return res.status(401).json({ message: "Token no autorizado" });
	if (!req.params.reportId)
		return res.status(400).json({ message: "Falta el id del reporte" });
	try {
		const reportId = Number(req.params.reportId);
		const petUser = await getOnePetLostUser(req._user.id, reportId);
		if (!petUser) {
			return res.status(404).json({ message: "Mascota no encontrada" });
		}
		return res.json(petUser); // Devolver la mascota encontrada
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error al obtener la mascota perdida", error });
	}
});

//eliminar reporte
app.delete("/me/my-pets/:petId", authMiddleware, async (req, res) => {
	if (!req._user.id)
		return res.status(401).json({ message: "Token no autorizado" });
	if (!req.params.petId)
		return res.status(400).json({ message: "Falta el id del reporte" });
	try {
		const deleteOneReport = await deleteReport(
			req._user.id,
			Number(req.params.petId)
		);
		return res.json(deleteOneReport);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error al eliminar el reporte", error });
	}
});

//buscamos pets cercanos a una ubicacion
app.get("/search-pets", async (req, res) => {
	const { lat, lng, rango } = req.query;
	if (!lat || !lng || !rango)
		return res.status(400).json({ message: "Falta la latitud y la longitud" });
	try {
		const allPets = await searchPets(lat, lng, rango);
		return res.json(allPets);
	} catch (error) {
		return res.status(500).json({
			message: "Error al obtener las mascotas perdidas cerca de un lugar",
			error,
		});
	}
});

//enviar email
app.post("/send-email", async (req, res) => {
	const { nombre, email, telefono, informacion, namePet } = req.body;
	if (!email || !nombre || !telefono || !informacion || !namePet)
		return res.status(400).json({
			message:
				"Falta el email, nombre, telefono, informacion o el nombre de la mascota",
		});
	try {
		const response = await SendEmail(
			nombre,
			email,
			telefono,
			informacion,
			namePet
		);
		return res.json(response);
	} catch (error) {
		return res.status(500).json({
			message: "Error al enviar el email",
			error,
		});
	}
});
//////////////////////////////////////////
const ruta = path.join(__dirname, "../fe-dist");
app.use(express.static(ruta));

app.listen(port, () => console.log(`conectate al puerto ${port}!`));
