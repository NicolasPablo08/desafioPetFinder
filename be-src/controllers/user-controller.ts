import { User, Pet } from "../models/index";
import * as bcrypt from "bcrypt"; //nuevo algoritmo para hashear password, mas seguro que "crypto"
import * as jwt from "jsonwebtoken";
import { transporter } from "../lib/nodemailer";
import "dotenv/config";

//cracion del hash para el password
async function getHash(pass: string) {
  const saltRounds = 10;
  return await bcrypt.hash(pass, saltRounds);
}

//creacion de nuevo usuario, solo email y password
export async function createUser(email: string, password: string) {
  if (!email || !password) {
    console.error("falta el email o el password en la funcion createUser del userController");
    return { status: "error" };
  }
  try {
    const passwordHash = await getHash(password);
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { email, passwordHash },
    });
    if (created) {
      const user = await User.findOne({
        where: { email },
      });
      const token = jwt.sign({ id: user.get("id") }, SECRET_KEY);
      return { status: "success", message: "Tu cuenta ha sido creada!", token };
    } else {
      return { status: "warning", message: "El email ingresado ya se encuentra registrado" };
    }
  } catch (error) {
    console.error("Error en la funcion createUser del userController", error);
    return { status: "error" };
  }
}

//frase secreta para la validacion del token que representa al usuario
const SECRET_KEY = process.env.SECRET_KEY || "estaEsLaFraseSecretaDelToken";

export async function loginUser(email: string, password: string) {
  if (!email || !password) {
    console.error("falta el email o el password en la funcion loginUser del userController");
    return { status: "error" };
  }
  try {
    const user = await User.findOne({
      where: { email },
    });
    if (!user)
      return { status: "warning", message: "El email ingresado no se encuentra registrado" };

    const match = await bcrypt.compare(password, user.get("passwordHash")); //compare se encarga de hashear password para comparar
    if (!match) return { status: "warning", message: "la contraseña ingresada es incorrecta" };

    const token = jwt.sign({ id: user.get("id") }, SECRET_KEY);
    return {
      status: "success",
      message: "Has iniciado sesion con exito",
      token,
      name: user.dataValues.name,
      localidad: user.dataValues.localidad,
    };
  } catch (error) {
    console.error("Error en la funcion loginUser del userController", error);
    return { status: "error" };
  }
}
//setear nombre y localidad
export async function setNameAndLocalidad(name: string, localidad: string, id: number) {
  if (!name || !localidad || !id) {
    console.error(
      "falta el nombre, la localidad o el id del usuario en la funcion setNameAndLocalidad del userController"
    );
    return { status: "error" };
  }
  try {
    const result = await User.update({ name, localidad }, { where: { id } });
    if (!result[0]) {
      return { status: "warning", message: "No se pudo actualizar tu perfil" };
    }
    return { status: "success", message: "Se ha actualizado tu perfil" };
  } catch (error) {
    console.error("Error en la funcion setNameAndLocalidad del userController", error);
    return { status: "error" };
  }
}
//cambiar el password
export async function setNewPassword(password: string, id: number) {
  if (!password || !id) {
    console.error(
      "falta el ide del usuario o el password en la funcion setNewPassword del userController"
    );
    return { status: "error" };
  }
  try {
    const passwordHash = await getHash(password);
    const result = await User.update({ passwordHash }, { where: { id } });
    const token = jwt.sign({ id }, SECRET_KEY);
    if (!result[0]) {
      return { status: "warning", message: "No se pudo actualizar tu contraseña" };
    }
    return {
      status: "success",
      message: "Se ha actualizado tu contraseña, vuelve a iniciar sesion",
      token,
    };
  } catch (error) {
    console.error("Error en la funcion setNewPassword del userController", error);
    return { status: "error" };
  }
}

//crear codigo de verificacion, enviar al emai y guardarlo temporalmente en la bd
export async function createCode(email: string) {
  if (!email) {
    console.error("falta el email en la funcion createCode del userController");
    return { status: "error" };
  }
  try {
    const res = await User.findOne({ where: { email } });
    if (!res) {
      return { status: "warning", message: "El email ingresado no se encuentra registrado" };
    }
    //creamos el codigo y la estampa de tiempo
    const code = generateCode();
    const timeExpireCode = Date.now() + 1 * 60 * 1000; //el codigo expira en 1 minutos
    //guardamos eldigo en la db
    const writeCodeInDB = await User.update({ code, timeExpireCode }, { where: { email } });
    if (!writeCodeInDB) {
      console.error("No se pudo guardar el codigo en la db en la funcion createCode");
      return { status: "error" };
    }
    //utilizamos transporter de la libreria nomadelier que nos permite enviar emails
    const data = await transporter.sendMail({
      from: `"mascotas perdidas" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Codigo de verificación "Mascotas Perdidas"`,
      text: `Ingresa el siguiente codigo de verificacion en la app para restaurar tu contraseña: ${code}.`,
    });
    if (data.rejected.length > 0) {
      return { status: "warning", message: "No se pudo enviar el codigo, intenta mas tarde!" };
    }
    return {
      status: "success",
      message: "El codigo fue enviado a tu email, revisa tu bandeja de entrada!",
    };
  } catch (error) {
    console.error("Error en la funcion createCode del userController", error);
    return { status: "error" };
  }
}

function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

//comparamos el codigo ingresado por el usuario con el que tenemos en la db
export async function compareCode(codigo: string, email: string) {
  if (!codigo || !email) {
    console.error("falta el codigo o el email en la funcion compareCode del userController");
    return { status: "error" };
  }
  try {
    const newDate = Date.now();
    const codigoFromDB = await User.findOne({
      where: { email },
      attributes: ["code", "timeExpireCode", "id"],
    });
    if (!codigoFromDB) {
      return { status: "warning", message: "El email ingresado no se encuentra registrado" };
    }

    const { code, timeExpireCode, id } = codigoFromDB.dataValues;
    const timeExpireCodeNumber = new Date(timeExpireCode).getTime();
    const diferencia = timeExpireCodeNumber - newDate;

    if (code === codigo && diferencia > 0) {
      const token = jwt.sign({ id }, SECRET_KEY);
      return { status: "success", message: "El codigo ingresado es correcto", token };
    } else if (diferencia <= 0) {
      return { status: "warning", message: "El codigo ya expiro, solicita uno nuevo" };
    } else {
      return { status: "warning", message: "El codigo ingresado es incorrecto" };
    }
  } catch (error) {
    console.error("Error en la funcion compareCode del userController", error);
    return { status: "error" };
  }
}
