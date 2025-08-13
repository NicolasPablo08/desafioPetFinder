import { User, Pet } from "../models/index";
import * as bcrypt from "bcrypt"; //nuevo algoritmo para hashear password, mas seguro que "crypto"
import * as jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary";

//cracion del hash para el password
async function getHash(pass: string) {
	const saltRounds = 10;
	return await bcrypt.hash(pass, saltRounds);
}

//creacion de nuevo usuario, solo email y password
export async function createUser(email: string, password: string) {
	if (!email || !password)
		throw "falta el email o la contraseña para crear el perfil";
	try {
		const passwordHash = await getHash(password);
		const [user, created] = await User.findOrCreate({
			where: { email },
			defaults: { email, passwordHash },
		});
		if (created) {
			return { message: "Usuario creado" };
		} else {
			return { message: "El usuario ya existe" };
		}
	} catch (error) {
		return { message: "Error al crear el usuario", error };
	}
}

//frase secreta para la validacion del token que representa al usuario
const SECRET_KEY = process.env.SECRET_KEY || "estaEsLaFraseSecretaDelToken";

export async function loginUser(email: string, password: string) {
	if (!email || !password)
		throw "falta el email o la contraseña para buscar el perfil";
	try {
		const user = await User.findOne({
			where: { email },
		});
		if (!user) return { message: "Usuario no existe" };

		const match = await bcrypt.compare(password, user.get("passwordHash")); //compare se encarga de hashear password para comparar
		if (!match) return { message: "Contraseña incorrecta" };

		const token = jwt.sign({ id: user.get("id") }, SECRET_KEY);
		return { token };
	} catch (error) {
		return { message: "Error al buscar el usuario", error };
	}
}
//setear nombre y localidad
export async function setNameAndLocalidad(
	name: string,
	localidad: string,
	id: number
) {
	if (!name || !localidad || !id)
		throw "falta el nombre la localidad o el id para cargar en el perfil";
	try {
		await User.update({ name, localidad }, { where: { id } });
		return { message: "Perfil actualizado" };
	} catch (error) {
		return { message: "Error al actualizar el perfil", error };
	}
}
//cambiar el password
export async function setNewPassword(password: string, id: number) {
	if (!password || !id)
		throw "falta el nuevo password o el id para cargar en el perfil";
	try {
		const passwordHash = await getHash(password);
		await User.update({ passwordHash }, { where: { id } });
		const token = jwt.sign({ id }, SECRET_KEY);
		return { token };
	} catch (error) {
		return { message: "Error al actualizar el password", error };
	}
}
//crear nuevo reporte de una mascota vinculada a un usuario
export async function createReport(
	name: string,
	location: string,
	imageUrl: string,
	userId: number
) {
	if (!name || !location || !imageUrl || !userId)
		throw "Falta el nombre, locacion, imagen o userId de la mascota a reportar";
	try {
		const uploadImageToCloudinary = await cloudinary.uploader.upload(imageUrl, {
			resource_type: "image",
			discard_original_filename: true,
			width: 1000,
		});
		if (!uploadImageToCloudinary)
			throw "No se pudo subir la imagen a cloudinary";

		const newPetReport = await Pet.create({
			name,
			location,
			imageUrl: uploadImageToCloudinary.secure_url,
			lost: true,
			UserId: userId,
		});
		return newPetReport;
	} catch (error) {
		return { message: "Error al crear el reporte de la mascota", error };
	}
}
//obtener las mascotas perdidas de un user
export async function getPetsLostUser(userId: number) {
	if (!userId) throw "Falta el userId para obtener las mascotas perdidas";
	try {
		const petsLost = await Pet.findAll({
			where: { lost: true, UserId: userId },
		});
		return petsLost;
	} catch (error) {
		return { message: "Error al obtener las mascotas perdidas", error };
	}
}
//obtener una mascota perdida de un user
export async function getOnePetLostUser(userId: number, reportId: number) {
	if (!userId || !reportId)
		throw "Falta el userId o el reportId para obtener la mascota perdida";
	try {
		const petLost = await Pet.findOne({
			where: { lost: true, UserId: userId, id: reportId },
		});
		return petLost;
	} catch (error) {
		return { message: "Error al obtener la mascota perdida", error };
	}
}

//editar el reporte de una mascota
export async function editReport(
	reportId: number,
	userId: number,
	name?: string,
	location?: string,
	imageUrl?: string
) {
	if (!reportId || !userId)
		throw "Falta el reportId o el userId para editar el reporte";
	try {
		const updateData: { name?: string; location?: string; imageUrl?: string } =
			{};
		if (name) updateData.name = name;
		if (location) updateData.location = location;
		if (imageUrl) {
			const uploadImageToCloudinary = await cloudinary.uploader.upload(
				imageUrl,
				{
					resource_type: "image",
					discard_original_filename: true,
					width: 1000,
				}
			);
			if (!uploadImageToCloudinary)
				throw "No se pudo subir la imagen a cloudinary";
			updateData.imageUrl = uploadImageToCloudinary.secure_url;
		}
		const editReport = await Pet.update(updateData, {
			where: { UserId: userId, id: reportId },
		});
		return "Reporte editado exitosamente";
	} catch (error) {
		return { message: "Error al editar el reporte", error };
	}
}
//eliminar un reporte de una mascota de un user
export async function deleteReport(userId: number, reportId: number) {
	if (!userId || !reportId)
		throw "Falta el userId o el reportId para eliminar el reporte";
	try {
		const reportDelete = await Pet.update(
			{ lost: false },
			{ where: { UserId: userId, id: reportId } }
		);
		return "Reporte eliminado exitosamente";
	} catch (error) {
		return { message: "Error al eliminar el reporte", error };
	}
}
