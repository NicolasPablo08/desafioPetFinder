import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import * as cors from "cors";
import {
  createUser,
  loginUser,
  setNameAndLocalidad,
  setNewPassword,
  createCode,
  compareCode,
} from "./controllers/user-controller";
import "dotenv/config";
import {
  searchPets,
  createReport,
  getPetsLostUser,
  editReport,
  getOnePetLostUser,
  deleteReport,
  sendEmail,
} from "./controllers/pet-controller";

console.log(process.env.SEQUELIZE_URL);

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.SERVER_PORT || 3000;

//creacion de nuevo usuario
app.post("/auth", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    console.error("Falta el email o la contraseña en /auth de la API");
    return { status: "error" };
  }
  try {
    const result = await createUser(req.body.email, req.body.password);
    if (result.status === "success") {
      return res.status(200).json(result);
    } else if (result.status === "warning") {
      return res.status(400).json(result);
    } else return res.status(500).json(result);
  } catch (error) {
    console.error("Error en /auth de la API", error);
    return res.status(500).json({ status: "error" });
  }
});
//nos logueamos para obtener el token que guarda el id del user
app.post("/auth/token", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    console.error("Falta el email o la contraseña en /auth/token de la API");
    return { status: "error" };
  }
  try {
    const result = await loginUser(req.body.email, req.body.password);
    if (result.status === "success") {
      return res.status(200).json(result);
    } else if (result.status === "warning") {
      return res.status(400).json(result);
    } else return res.status(500).json(result);
  } catch (error) {
    console.error("Error en /auth/token de la API", error);
    return res.status(500).json({ status: "error" });
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

//para setear nombre y localidad
app.patch("/me/my-data", authMiddleware, async (req, res) => {
  if (!req.body.name || !req.body.location) {
    console.error("Falta el nombre o la ubicacion en /me/my-data de la API");
    return { status: "error" };
  }
  if (!req._user) {
    console.error("Token no autorizado en /me/mis-datos de la API");
    return { status: "error" };
  }
  try {
    const result = await setNameAndLocalidad(req.body.name, req.body.location, req._user.id);
    if (result.status === "success") {
      return res.status(200).json(result);
    } else if (result.status === "warning") {
      return res.status(400).json(result);
    } else return res.status(500).json(result);
  } catch (error) {
    console.error("Error en /me/my-data de la API", error);
    return res.status(500).json({ status: "error" });
  }
});

//para cambiar contraseña
app.patch("/me/my-pass", authMiddleware, async (req, res) => {
  if (!req.body.password) {
    console.error("Falta la contraseña en /me/my-pass de la API");
    return { status: "error" };
  }
  if (!req._user) {
    console.error("Token no autorizado en /me/my-pass de la API");
    return { status: "error" };
  }
  try {
    const result = await setNewPassword(req.body.password, req._user.id);
    if (result.status === "success") {
      return res.status(200).json(result);
    } else if (result.status === "warning") {
      return res.status(400).json(result);
    } else return res.status(500).json(result);
  } catch (error) {
    console.error("Error en /me/mis-pass de la API", error);
    return res.status(500).json({ status: "error" });
  }
});
//reportar nueva mascota perdida vinculada a un usuario
app.post("/me/my-pets", authMiddleware, async (req, res) => {
  if (!req.body.name || !req.body.lat || !req.body.lng || !req.body.imageUrl) {
    console.error(
      "Falta el nombre, latitud, longitud o imagen de la mascota a reportar en /me/my-pets POST de la API"
    );
    return { status: "error" };
  }
  if (!req._user) {
    console.error("Token no autorizado en /me/my-pets POST de la API");
    return { status: "error" };
  }
  try {
    const result = await createReport(
      req.body.name,
      req.body.lat,
      req.body.lng,
      req.body.imageUrl,
      req._user.id
    );
    if (result.status === "success") {
      return res.status(200).json(result);
    } else if (result.status === "warning") {
      return res.status(400).json(result);
    } else return res.status(500).json(result);
  } catch (error) {
    console.error("Error en /me/my-pets de la API", error);
    return res.status(500).json({ status: "error" });
  }
});

//obtener las mascotas que siguen "lost" de un usuario,lo utilizo en el metodo "init" del state
app.get("/me/my-pets", authMiddleware, async (req, res) => {
  if (!req._user) {
    console.error("Token no autorizado en /me/my-pets GET de la API");
    return { status: "error" };
  }
  try {
    const result = await getPetsLostUser(req._user.id);
    if (result.status === "success") {
      return res.status(200).json(result);
    } else if (result.status === "warning") {
      return res.status(400).json(result);
    } else return res.status(500).json(result);
  } catch (error) {
    console.error("Error en /me/my-pets GET de la API", error);
    return res.status(500).json({ status: "error" });
  }
});

//editar reporte de mascota perdida vinculada a un usuario
app.patch("/me/my-pets/:petId", authMiddleware, async (req, res) => {
  if (!req._user.id) {
    console.error("Token no autorizado en /me/my-pets/:petId PATCH de la API");
    return { status: "error" };
  }
  if (!req.params.petId) {
    console.error("Falta el id de la mascota en /me/my-pets/:petId PATCH de la API");
    return { status: "error" };
  }
  const { name, imageUrl, lat, lng } = req.body;
  if (!name || !imageUrl || !lat || !lng) {
    console.error("Faltan datos para editar el reporte en /me/my-pets/:petId PATCH de la API");
    return {
      status: "warning",
      message: "Todos los campos son obligatorios para editar la publicacion",
    };
  }

  try {
    const result = await editReport(
      Number(req.params.petId),
      req._user.id,
      name,
      lat,
      lng,
      imageUrl
    );
    if (result.status === "success") {
      return res.status(200).json(result);
    } else if (result.status === "warning") {
      return res.status(400).json(result);
    } else return res.status(500).json(result);
  } catch (error) {
    console.error("Error en /me/my-pets/:petId PATCH de la API", error);
    return res.status(500).json({ status: "error" });
  }
});

//eliminar reporte
app.delete("/me/my-pets/:petId", authMiddleware, async (req, res) => {
  if (!req._user.id) {
    console.error("Token no autorizado en /me/my-pets/:petId DELETE de la API");
    return { status: "error" };
  }
  if (!req.params.petId) {
    console.error("Falta el id de la mascota en /me/my-pets/:petId DELETE de la API");
    return { status: "error" };
  }
  try {
    const result = await deleteReport(req._user.id, Number(req.params.petId));
    if (result.status === "success") {
      return res.status(200).json(result);
    } else if (result.status === "warning") {
      return res.status(400).json(result);
    } else return res.status(500).json(result);
  } catch (error) {
    console.error("Error en /me/my-pets/:petId DELETE de la API", error);
    return res.status(500).json({ status: "error" });
  }
});

//obtener una mascota de un usuario
app.get("/me/my-pets/:reportId", authMiddleware, async (req, res) => {
  if (!req._user.id) return res.status(401).json({ message: "Token no autorizado" });
  if (!req.params.reportId) return res.status(400).json({ message: "Falta el id del reporte" });
  try {
    const reportId = Number(req.params.reportId);
    const petUser = await getOnePetLostUser(req._user.id, reportId);
    if (!petUser) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }
    return res.json(petUser); // Devolver la mascota encontrada
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener la mascota perdida", error });
  }
});

//buscamos pets cercanos a una ubicacion
app.get("/search-pets", async (req, res) => {
  const { lat, lng, rango } = req.query;
  if (!lat || !lng || !rango) {
    console.error(
      "Falta el la latitud, longitud o el rango de la ubicacion a buscar en /search-pets de la API"
    );
    return { status: "error" };
  }
  try {
    const result = await searchPets(lat, lng, rango);
    if (result.status === "success") {
      return res.status(200).json(result);
    } else if (result.status === "warning") {
      return res.status(400).json(result);
    } else return res.status(500).json(result);
  } catch (error) {
    console.error("Error en /search-pets de la API", error);
    return res.status(500).json({ status: "error" });
  }
});

//enviar email
app.post("/send-email", async (req, res) => {
  const { nombre, email, telefono, informacion, namePet } = req.body;
  if (!email || !nombre || !telefono || !informacion || !namePet) {
    console.error(
      "Falta el email, nombre, telefono, informacion o el nombre de la mascota en /send-email de la API"
    );
    return { status: "error" };
  }
  try {
    const result = await sendEmail(nombre, email, telefono, informacion, namePet);
    if (result.status === "success") {
      return res.status(200).json(result);
    } else if (result.status === "warning") {
      return res.status(400).json(result);
    } else return res.status(500).json(result);
  } catch (error) {
    console.error("Error en /send-email de la API", error);
    return res.status(500).json({ status: "error" });
  }
});

//crear codigo de verificacion con el email del usuario y enviarlo a su email
app.post("/create-code", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    console.error("Falta el email /create-code de la API");
    return { status: "error" };
  }
  try {
    const result = await createCode(email);
    if (result.status === "success") {
      return res.status(200).json(result);
    } else if (result.status === "warning") {
      return res.status(400).json(result);
    } else return res.status(500).json(result);
  } catch (error) {
    console.error("Error en /create-code de la API", error);
    return res.status(500).json({ status: "error" });
  }
});
//comparamos el codigo y obtenemos el token para cambiar la contraseña
app.post("/compare-code", async (req, res) => {
  const { codigo, email } = req.body;
  if (!codigo || !email) {
    console.error("Falta el email o codigo en  /compare-code de la API");
    return { status: "error" };
  }
  try {
    const result = await compareCode(codigo, email);
    if (result.status === "success") {
      return res.status(200).json(result);
    } else if (result.status === "warning") {
      return res.status(400).json(result);
    } else return res.status(500).json(result);
  } catch (error) {
    console.error("Error en /compare-code de la API", error);
    return res.status(500).json({ status: "error" });
  }
});
//////////////////////////////////////////
const ruta = path.join(__dirname, "../dist");
app.use(express.static(ruta));

app.listen(port, () => console.log(`conectate al puerto ${port}!`));
