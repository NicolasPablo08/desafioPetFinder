import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as path from "path";
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
} from "./controllers/user-controller";

console.log(process.env.SEQUELIZE_URL);

const app = express();
app.use(express.json());
const port = process.env.SERVER_PORT || 3000;

//creacion de nuevo usuario
app.post("/auth", async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "falta el email o la contraseña para crear el perfil" });
  try {
    const newUser = await createUser(req.body.email, req.body.password);
    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el usuario", error });
  }
});
//nos logueamos para obtener el token que guarda el id del user
app.post("/auth/token", async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "falta el email o la contraseña para el logIn" });
  try {
    const tokenUser = await loginUser(req.body.email, req.body.password);
    res.json(tokenUser);
  } catch (error) {
    return res.status(500).json({ message: "Error al iniciar sesion", error });
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
app.get("/me", authMiddleware, async (req, res) => {
  res.json(req._user);
});

//para setear nombre y localidad
app.patch("/me/mis-datos", authMiddleware, async (req, res) => {
  if (!req.body.name || !req.body.localidad)
    return res.status(400).send({
      message: "falta el nombre o la localidad para cargar en el perfil",
    });
  if (!req._user) return res.status(401).json({ message: "Token no autorizado" });
  try {
    const user = await setNameAndLocalidad(req.body.name, req.body.localidad, req._user.id);
    return res.json({ message: "datos cargados" });
  } catch (error) {
    return res.status(500).json({ message: "Error al cargar los datos", error });
  }
});

//para cambiar contraseña
app.patch("/me/mi-pass", authMiddleware, async (req, res) => {
  if (!req.body.newPassword)
    return res.status(400).send({
      message: "falta el password para cambiar en el perfil",
    });
  if (!req._user) return res.status(401).json({ message: "Token no autorizado" });
  try {
    const newToken = await setNewPassword(req.body.newPassword, req._user.id);
    return res.json(newToken);
  } catch (error) {
    return res.status(500).json({ message: "Error al cambiar el password", error });
  }
});
//reportar nueva mascota perdida vinculada a un usuario
app.post("/me/my-pets", authMiddleware, async (req, res) => {
  if (!req.body.name || !req.body.location || !req.body.imageUrl)
    throw "Falta el nombre, locacion o imagen de la mascota a reportar";
  if (!req._user) return res.status(401).json({ message: "Token no autorizado" });
  try {
    const newReport = await createReport(
      req.body.name,
      req.body.location,
      req.body.imageUrl,
      req._user.id
    );
    return res.json({ message: "Reporte de mascota creado" });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el reporte de la mascota", error });
  }
});
//obtener las mascotas que siguen "lost" deun usuario
app.get("/me/my-pets", authMiddleware, async (req, res) => {
  if (!req._user.id) return res.status(401).json({ message: "Token no autorizado" });
  try {
    const petsUser = await getPetsLostUser(req._user.id);
    return res.json(petsUser);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener las mascotas perdidas", error });
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

//editar reporte de mascota perdida vinculada a un usuario
app.patch("/me/my-pets/:reportId", authMiddleware, async (req, res) => {
  if (!req._user.id) return res.status(401).json({ message: "Token no autorizado" });
  if (!req.params.reportId) return res.status(400).json({ message: "Falta el id del reporte" });
  try {
    const { name, location, imageUrl } = req.body;
    const reportEdit = await editReport(
      Number(req.params.reportId),
      req._user.id,
      name,
      location,
      imageUrl
    );
    return res.json({ message: "Reporte editado satisfactoriamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al editar el reporte", error });
  }
});
//eliminar reporte o en realidad marcar como encontrada
app.delete("/me/my-pets/:reportId", authMiddleware, async (req, res) => {
  if (!req._user.id) return res.status(401).json({ message: "Token no autorizado" });
  if (!req.params.reportId) return res.status(400).json({ message: "Falta el id del reporte" });
  try {
    const deleteOneReport = await deleteReport(req._user.id, Number(req.params.reportId));
    return res.json({ message: "Reporte eliminado satisfactoriamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el reporte", error });
  }
});

//////////////////////////////////////////
const ruta = path.join(__dirname, "../fe-dist");
app.use(express.static(ruta));

app.listen(port, () => console.log(`conectate al puerto ${port}!`));
