import { User, Pet } from "../models/index";
import { client } from "../lib/algolia";

export async function searchPets(lat: number, lng: number, rango: number) {
	if (!lat || !lng || !rango)
		throw new Error("Falta latitud, longitud o rango");
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
			return pets;
		} else {
			return [];
		}
	} catch (error) {
		return { message: "Error al buscar mascotas", error };
	}
}
