import L from "leaflet";

//encontre esta forma de crear el icono de ubicacion en el mapa
const customIcon = L.icon({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

//////////////////codigo de leaflet para dibujar el mapa/////////////////////////
export function initMap(divMap: Element, lat?: number, lng?: number) {
	const map = L.map(divMap, {
		zoomControl: false, // Desactiva el control de zoom
		attributionControl: false, // Desactiva el control de atribución
	}).setView([lat || -34.6, lng || -58.38], 13); //coordenadas para que inicie en la ciudad de buenos aires

	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution: "&copy; OpenStreetMap contributors",
	}).addTo(map);

	let currentMarker: L.Marker | null = null;
	if (lat && lng) {
		currentMarker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
	}
	// Muy importante para que se redibuje correctamente, sin esto el mapa aparece difuso
	setTimeout(() => {
		map.invalidateSize();
	}, 0);

	//cuando hacemos click en un punto del mapa ponemos un popop y obtenemos las coordenadas
	//y siempre nos quedamos con el ultimo marcador, sino pone marcadores en cada click

	map.on("click", (e) => {
		const { lat, lng } = e.latlng;

		// Si ya hay un marcador, lo removemos
		if (currentMarker) {
			map.removeLayer(currentMarker);
		}
		// Creamos uno nuevo
		currentMarker = L.marker([lat, lng], { icon: customIcon })
			.addTo(map)
			.openPopup();

		//devolvemos las coordenadas elegidas a la page
		// Emitir evento personalizado con las coordenadas
		const event = new CustomEvent("location-selected", {
			detail: { lat, lng },
			bubbles: true, // para que suba por el DOM si querés
			composed: true, // para que atraviese shadow DOM
		});
		divMap.dispatchEvent(event);
	});

	return map;
}
///////////////////////////////////////////////////////////////////////////////

////////////Buscar la ubicacion ingresada en el input en el mapa////////////////
export async function obtainCoords(location: string, map: L.Map) {
	const response = await fetch(
		`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
			location
		)}&countrycodes=ar`
	);
	const data = await response.json();
	if (data.length > 0) {
		const result = data[0];
		const lat = parseFloat(result.lat);
		const lng = parseFloat(result.lon);

		//volvemos a setear la ubicacion en el mapa con las coordenadas que obtuvimos
		map.setView([lat, lng], 13);
	}
}

//obtener localidad y provincia a partir de las coordenadas para colocar en las cards
export async function getCiudadProvincia(lat: number, lng: number) {
	const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
	const response = await fetch(url, {
		headers: { "User-Agent": "mi-app/1.0" }, // algunos servidores lo requieren
	});
	const data = await response.json();

	if (data && data.address) {
		const { city, town, village, state } = data.address;
		const ciudad = city || town || village || "Desconocida";
		const provincia = state || "Desconocida";
		return `${ciudad}, ${provincia}`;
	}

	return "Ubicación desconocida";
}
