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
			<div class="form">
				<div class="text">
					<text-comp class="text-title" variant="title">Buscar mascotas cerca</text-comp>		
					<text-comp class="text-body" variant="subtitle">Ingresá la siguiente información para realizar la busqueda.</text-comp>
				</div>
				<div class="ubicacion">
					<input-comp class="input-ubicacion" placeholder="Ubicacion + Enter..." type="text">Ubicación (por ej. Ciudad, provincia)</input-comp>
					<div>
						<text-comp class="text-body" variant="text">Pon un punto de referencia en el mapa para buscar las mascotas perdidas cerca.</text-comp>
						<div class="mapa" id="map"></div>
					</div>	
					<input-comp class="input-rango" type="text">Rango de busqueda (metros)</input-comp>
				</div>
				<div class="buttons">
					<button-comp class="button-report" variant="blue">Buscar mascotas</button-comp>
					<button-comp class="button-volver" variant="green">Volver</button-comp>
        </div>
			</div>	
			<message-comp class="message-comp"></message-comp> 
			<load-comp class="load-comp"></load-comp>     
			`;
      style.innerHTML = `
			.container{
				box-sizing: border-box;
				min-height: calc(100vh - 60px);
        padding:40px 20px 70px 20px;
				width: 100%;
				display: flex;
				justify-content: center;			
				}
      .form{
        max-width: 550px;
        margin:0;
        display: flex;
        flex-direction: column;
        align-items: center;
				gap:40px;
				justify-content: space-between;
				}
      .text{
        text-align: center;
        display: flex;
        flex-direction: column;
        gap:40px;
      }
			.ubicacion{
				width: 100%;
				display:flex;
				flex-direction: column;
				gap:40px;
			}
      .mapa{
        width: 100%;
        height:350px;
        background-color: #C4C4C4;
        border-radius: 10px;
      }
      .buttons{
				width: 100%;
				display:flex;
				flex-direction: column;
      	gap:20px;
      }
			.message-comp{
        display: none;
        position: fixed; /* Fija la posición en la pantalla */
        top: 50%; /* Centra verticalmente */
        left: 50%; /* Centra horizontalmente */
        transform: translate(-50%, -50%); /* Ajusta el centro */
        z-index: 999; /* Asegura que este por encima de otros elementos */
      }	
			.load-comp{
        display: none;
        position: fixed; /* Fija la posición en la pantalla */
        top: 50%; /* Centra verticalmente */
        left: 50%; /* Centra horizontalmente */
        transform: translate(-50%, -50%); /* Ajusta el centro */
        z-index: 999;
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
      const messageComp = shadow.querySelector(".message-comp");
      const loadComp = shadow.querySelector(".load-comp");
      const formContainer = shadow.querySelector(".form");

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
        if (!lat || !lng) {
          messageComp.style.display = "inherit";
          messageComp.textContent = "Debes seleccionar un punto en el mapa!";
          setTimeout(() => {
            messageComp.style.display = "none";
          }, 4000);
          return;
        }
        if (!rango) {
          messageComp.style.display = "inherit";
          messageComp.textContent = "Debes ingresar un rango de busqueda!";
          setTimeout(() => {
            messageComp.style.display = "none";
          }, 4000);
          return;
        }
        searchPets(lat, lng, Number(rango));
      });
      async function searchPets(lat: number, lng: number, rango: number) {
        formContainer.style.filter = "blur(5px)";
        loadComp.style.display = "inherit";
        try {
          const response = await state.searchPetsNearby(lat, lng, rango);
          if (response.status === "success" || response.status === "warning") {
            Router.go("/lost-pets");
          } else {
            formContainer.style.filter = "none";
            loadComp.style.display = "none";
            messageComp.style.display = "inherit";
            messageComp.textContent = "Error al buscar mascotas, intenta mas tarde!";
            setTimeout(() => {
              Router.go("/");
            }, 4000);
          }
        } catch (error) {
          console.error(
            "error en la funcion seachPets de la page share-loc para buscar los reportes",
            error
          );
          Router.go("/");
        }
      }
    }
  }
  customElements.define("share-loc-page", ShareLocPage);
}
