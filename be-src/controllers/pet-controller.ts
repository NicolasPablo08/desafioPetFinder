import { User, Pet } from "../models/index";
import cloudinary from "../lib/cloudinary";
import { client } from "../lib/algolia";
import { transporter } from "../lib/nodemailer";

//crear nuevo reporte de una mascota vinculada a un usuario
export async function createReport(
  name: string,
  lat: number,
  lng: number,
  imageUrl: string,
  userId: number
) {
  if (!name || !lat || !lng || !imageUrl || !userId) {
    console.error(
      "falta el nombre, latitud, longitud, imagen o id del usuario en la funcion createReport del userController"
    );
    return { status: "error" };
  }
  try {
    const uploadImageToCloudinary = await cloudinary.uploader.upload(imageUrl, {
      resource_type: "image",
      discard_original_filename: true,
      width: 1000,
    });
    if (!uploadImageToCloudinary) {
      console.error(
        "No se pudo subir la imagen a cloudinary en la funcion createReport del userController"
      );
      return { status: "error" };
    }

    const newPetReport = await Pet.create({
      name,
      lat,
      lng,
      imageUrl: uploadImageToCloudinary.secure_url,
      imagePublicId: uploadImageToCloudinary.public_id, //necesario para eliminar o editar una imagen en cloudinary
      lost: true,
      UserId: userId,
    });
    if (!newPetReport) {
      console.error("No se pudo crear el reporte en la funcion createReport del userController");
      return { status: "error" };
    }
    const algoliaRes = await client.saveObject({
      indexName: "pets",
      body: {
        objectID: newPetReport.get("id"),
        name: newPetReport.get("name"),
        _geoloc: {
          lat: newPetReport.get("lat"),
          lng: newPetReport.get("lng"),
        },
      },
    });
    if (!algoliaRes) {
      console.error("No se pudo guardar el reporte en algolia en la funcion createReport");
      return { status: "error" };
    }
    return {
      status: "success",
      message: "Se ha publicado tu mascota, suerte con la busqueda!",
      newPetReport,
    };
  } catch (error) {
    console.error("Error en la funcion createReport del userController", error);
    return { status: "error" };
  }
}

//obtener las mascotas perdidas de un user
export async function getPetsLostUser(userId: number) {
  if (!userId) {
    console.error("falta el id del usuario en la funcion getPetsLostUser del userController");
    return { status: "error" };
  }
  try {
    const petsLost = await Pet.findAll({
      where: { lost: true, UserId: userId },
    });
    if (!petsLost) {
      console.error("No se pudieron obtener las mascotas perdidas en getPetsLostUser");
      return { status: "error" };
    }

    return { status: "success", message: "Mascotas perdidas obtenidas con exito", petsLost };
  } catch (error) {
    console.error("Error en la funcion getPetsLostUser del userController", error);
    return { status: "error" };
  }
}

//editar el reporte de una mascota
export async function editReport(
  petId: number,
  userId: number,
  name?: string,
  lat?: number,
  lng?: number,
  imageUrl?: string
) {
  if (!petId || !userId) {
    console.error(
      "falta el id de la mascota o el id del usuario en la funcion editReport del userController"
    );
    return { status: "error" };
  }
  try {
    const pet = await Pet.findOne({ where: { id: petId, UserId: userId } });
    const updateData: {
      name?: string;
      lat?: number;
      lng?: number;
      imageUrl?: string;
    } = {};
    if (name) updateData.name = name;
    if (lat) updateData.lat = lat;
    if (lng) updateData.lng = lng;
    if (imageUrl) {
      const uploadImageToCloudinary = await cloudinary.uploader.upload(imageUrl, {
        public_id: pet.dataValues.imagePublicId,
        overwrite: true, // Esto permite reemplazar la imagen
        resource_type: "image",
        discard_original_filename: true,
        width: 1000,
      });
      if (!uploadImageToCloudinary) {
        console.error(
          "No se pudo subir la imagen a cloudinary en la funcion editReport del userController"
        );
        return { status: "error" };
      }
      updateData.imageUrl = uploadImageToCloudinary.secure_url;
    }
    const editReport = await Pet.update(updateData, {
      where: { UserId: userId, id: petId },
    });
    if (!editReport[0]) {
      console.error("No se pudo editar el reporte en la funcion editReport del userController");
      return { status: "error" };
    }
    const algoliaRes = await client.partialUpdateObject({
      indexName: "pets",
      objectID: petId.toString(),
      attributesToUpdate: { name, _geoloc: { lat, lng } },
    });
    if (!algoliaRes) {
      console.error("No se pudo actualizar el reporte en algolia en la funcion editReport");
      return { status: "error" };
    }
    const reportPet = await Pet.findOne({ where: { id: petId } });
    if (!reportPet) {
      console.error(
        "No se pudo obtener el reporte editado en la funcion editReport del userController"
      );
      return { status: "error" };
    }
    return {
      status: "success",
      message: "Se actualizo la publicacion de tu mascota, suerte con la busqueda!",
      reportPet,
    };
  } catch (error) {
    console.error("Error en la funcion editReport del userController", error);
    return { status: "error" };
  }
}

//eliminar un reporte de una mascota de un user
export async function deleteReport(userId: number, petId: number) {
  if (!userId || !petId) {
    console.error(
      "falta el id del usuario o el id de la mascota en la funcion deleteReport del userController"
    );
    return { status: "error" };
  }
  try {
    const reportToDelete = await Pet.findOne({
      where: { id: petId, UserId: userId },
    }); //buscamos el pet que queremos eliminar
    if (reportToDelete) {
      await reportToDelete.destroy({ force: true }); //si existe lo eliminamos totalmente, si no utilizamos force:true, solo se pone un flag de borrado
      await cloudinary.uploader.destroy(reportToDelete.dataValues.imagePublicId);
      const algoliaRes = await client.deleteObject({
        indexName: "pets",
        objectID: petId.toString(),
      });
      return { status: "success", message: " Se elimino la publicación de tu mascota" };
    } else {
      return {
        status: "warning",
        message: "No se pudo eliminar la publicacion, intenta mas tarde",
      };
    }
  } catch (error) {
    console.error("Error en la funcion deleteReport del userController", error);
    return { status: "error" };
  }
}

//obtener una mascota perdida de un user
export async function getOnePetLostUser(userId: number, reportId: number) {
  if (!userId || !reportId) {
    console.error(
      "falta el id del usuario o id de la mascota en la funcion getOnePetLostUser del userController"
    );
    return { status: "error" };
  }
  try {
    const petLost = await Pet.findOne({
      where: { lost: true, UserId: userId, id: reportId },
    });
    return petLost;
  } catch (error) {
    console.error("Error en la funcion getOnePetLostUser del userController", error);
    return { status: "error" };
  }
}

export async function sendEmail(
  nombre: string,
  email: string,
  telefono: string,
  informacion: string,
  namePet: string
) {
  if (!email || !nombre || !telefono || !informacion || !namePet) {
    console.error(
      "falta el email, el nombre, el telefono , la informacion o el nombre de la mascota en la funcion sendEmail del userController"
    );
    return { status: "error" };
  }
  try {
    //utilizamos transporter de la libreria nomadelier que nos permite enviar emails
    const data = await transporter.sendMail({
      from: `"mascotas perdidas" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `He visto a ${namePet}`,
      text: `Hola, soy ${nombre}. ${informacion}. Puedes contactarme al ${telefono}.`,
    });
    if (data.rejected.length > 0) {
      return { status: "warning", message: "No se pudo enviar el mensaje, intenta mas tarde!" };
    }
    return {
      status: "success",
      message: "Mensaje enviado, gracias por ayudar a encontrar una mascota!",
    };
  } catch (error) {
    console.error("Error en la funcion sendEmail del userController", error);
    return { status: "error" };
  }
}

//busqueda de mascotas perdidas cerca de la ubicacion del usuario sin loguear
export async function searchPets(lat: number, lng: number, rango: number) {
  if (!lat || !lng || !rango) {
    console.error(
      "falta la latitud, la longitud o el rango en la funcion searchPets del petController"
    );
    return { status: "error" };
  }
  try {
    const response = await client.search({
      requests: [
        {
          indexName: "pets",
          aroundLatLng: [lat, lng].join(","),
          aroundRadius: rango,
        },
      ],
    });
    const first = response.results[0];

    if ("hits" in first) {
      const hits = first.hits; // TS ahora entiende que `hits` existe
      // usar hits...
      const pets = await Pet.findAll({
        where: { id: hits.map((hit) => hit.objectID) },
        include: [{ model: User, attributes: ["email"] }], //solo el email del user
        raw: true, // devuelve objetos planos sin métodos ni metadatos
      });
      return {
        status: "success",
        message: "Encontramos mascotas perdidas cerca de tu ubicacion",
        pets,
      };
    } else {
      return {
        status: "warning",
        message: "No encontramos mascotas perdidas cerca de tu ubicacion",
        pets: [],
      };
    }
  } catch (error) {
    console.error("Error en la funcion searchPets del petController", error);
    return { status: "error" };
  }
}
