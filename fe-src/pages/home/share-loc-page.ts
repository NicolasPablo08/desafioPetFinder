import { state } from "../../state";
import { Router } from "@vaadin/router";
import { Dropzone } from "dropzone";
import { initMap, obtainCoords } from "../../lib/map";
import "leaflet/dist/leaflet.css"; //importamos estilos propios de leaflet

export function shareLocPage() {
  class ShareLocPage extends HTMLElement {
    dropzone: any;
    constructor() {
      super();
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      const style = document.createElement("style");
      div.classList.add("container");
      div.innerHTML = `
				<div class="text">
					<text-comp class="text-title" variant="title">Buscar mascotas cerca</text-comp>		
					<text-comp class="text-body" variant="text">Ingresá la siguiente información para realizar la busqueda.</text-comp>
				</div>
				<form class="form">
					<input-comp class="input-ubicacion" placeholder="Ubicacion + Enter..." type="text">Ubicación (por ej. Ciudad, provincia)</input-comp>
					<text-comp class="text-body" variant="text">Pon un punto de referencia en el mapa para buscar las mascotas perdidas cerca.</text-comp>
					<div class="mapa" id="map"></div>
					<input-comp class="input-rango" type="text">Rango de busqueda (metros)</input-comp>
					<button-comp class="button-report" variant="blue">Buscar mascotas</button-comp>
					<button-comp class="button-volver" variant="green">Volver</button-comp>
				</form>
        
			`;
      style.innerHTML = `
      .container{
        height: 100%;
        max-width: 100%;
        margin:0;
        padding:40px 20px 60px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap:90px;
      }
  
      .text{
        text-align: center;
        display: flex;
        flex-direction: column;
        gap:15px;
      }
      .form{
        width: 100%;
        display:flex;
        flex-direction: column;
        gap:20px;
      }
     
      .mapa{
        width: 100%;
        height:250px;
        margin-top:20px;
        background-color: #C4C4C4;
      }
      .button-report{
        margin-top:20px;
      }
      `;

      //agregamos el estilo de leaflet al shadow (en ejercicio anterior lo agregamos al html)
      const leafletStyle = document.createElement("style");
      leafletStyle.textContent = `
        @import url("https://unpkg.com/leaflet/dist/leaflet.css");
      `;
      shadow.appendChild(leafletStyle);

      shadow.appendChild(div);
      shadow.appendChild(style);

      const buttonReport = shadow.querySelector(".button-report");
      const buttonVolver = shadow.querySelector(".button-volver");

      //funcion para inicializar el mapa
      let map;
      const containerMap = div.querySelector(".mapa");
      if (containerMap) {
        map = initMap(containerMap);
      }
      //buscamos la ubicacion para obtener las coordenadas, utilizamos
      //la opcion de keydown para que se envie el input al presionar enter
      //ya que no hay boton de buscar
      const inputUbicacion = shadow.querySelector(".input-ubicacion");
      inputUbicacion.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const ubicacionValue = shadow
            .querySelector(".input-ubicacion")
            .shadowRoot.querySelector("input").value;
          obtainCoords(ubicacionValue, map);
        }
      });

      //boton cancelar
      buttonVolver.addEventListener("click", (e) => {
        e.preventDefault();
        Router.go("/");
      });

      //crear reporte con todos los datos
      let lat;
      let lng;
      containerMap.addEventListener("location-selected", (e) => {
        lat = e.detail.lat;
        lng = e.detail.lng;
      });
      buttonReport.addEventListener("click", (e) => {
        e.preventDefault();
        const rango = shadow.querySelector(".input-rango").shadowRoot.querySelector("input").value;
        if (!lat || !lng || !rango)
          return console.log("Faltan campos por completar, todos los campos son obligatorios");
        console.log(rango, lat, lng);
        //searchPets(lat, lng, rango);
      });
      async function searchPets(lat: number, lng: number, rango: number) {
        //funcion para buscar mascotas cerca de una ubicacion
        try {
          const respuesta = await state.searchPetsNearby(lat, lng, rango);
          if (respuesta !== "ok") {
            console.log("error al buscar los reportes");
          } else {
            Router.go("/lost-pets");
          }
        } catch (error) {
          console.error("error del servidor buscar los reportes", error);
        }
      }
    }
  }
  customElements.define("share-loc-page", ShareLocPage);
}
