import { state } from "../state";
import { Router } from "@vaadin/router";
import { Dropzone } from "dropzone";
import { initMap, obtainCoords } from "../lib/map";
import "leaflet/dist/leaflet.css"; //importamos estilos propios de leaflet

export function reportPage() {
	class ReportPage extends HTMLElement {
		dropzone: any;
		constructor() {
			super();
			this.dropzone = null; // Inicializar la variable para Dropzone
			this.render();
		}
		render() {
			const shadow = this.attachShadow({ mode: "open" });
			const div = document.createElement("div");
			const style = document.createElement("style");
			div.classList.add("container");
			const imagen = require("url:../icons/icon-img.png");
			div.innerHTML = `
			<div class= "report">
				<div class="text">
					<text-comp class="text-title" variant="title">Reportar mascota</text-comp>		
					<text-comp class="text-body" variant="subtitle">Ingresá la siguiente información para realizar el reporte de la mascota</text-comp>
				</div>
        <input-comp class="input-nombre" type="text">Nombre</input-comp>
        <div class="dropzone-container">
          <img class="img" src="${imagen}">
					<button-comp class="button-img" variant="blue">Agregar foto</button-comp>
        </div>
        <input-comp class="input-ubicacion" placeholder="Ubicacion + Enter..." type="text">Ubicación (por ej. Ciudad, provincia)</input-comp>
        <div class="container-mapa">
					<text-comp class="text-body" variant="text">Pon un punto de referencia en el mapa, por ejemplo, la ubicación donde lo viste por última vez</text-comp>
        	<div class="mapa" id="map"></div>
				</div>
				<div class="buttons">
          <button-comp class="button-report" variant="green">Reportar mascota</button-comp>
          <button-comp class="button-cancel" variant="gray">Cancelar</button-comp>
				</div>	
			</div>	
      <message-comp class="message-comp"></message-comp>

        
			`;
			style.innerHTML = `
      .container{
			box-sizing: border-box;
        min-height: calc(100vh - 60px);
        width: 100%;
        margin:0;
        padding:40px 20px 70px 20px;
        display: flex;
        justify-content: center;			
      }
			.report{
				max-height: 100%;
				max-width: 550px;
				display: flex;
				flex-direction: column;
				gap:20px;
				justify-content: space-between;
			}
      .text{
        text-align: center;
        display: flex;
        flex-direction: column;
        gap:40px;
      }
			.dropzone-container{
				width: 100%;
				display:flex;
				flex-direction: column;
			}
      .img{
        width:100%;
        height:250px;  
      }
      .mapa{
        width: 100%;
        height:350px;
        background-color: #C4C4C4;
				border-radius: 10px;
      }
      .buttons{
			margin-top: 40px;
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
      `;

			//agregamos el estilo de leaflet al shadow (en ejercicio anterior lo agregamos al html)
			const leafletStyle = document.createElement("style");
			leafletStyle.textContent = `
        @import url("https://unpkg.com/leaflet/dist/leaflet.css");
      `;
			shadow.appendChild(leafletStyle);

			shadow.appendChild(div);
			shadow.appendChild(style);
			//chequeo si estoy logueado
			const isLogin = state.checkLogin();

			const buttonImg = shadow.querySelector(".button-img");
			const buttonReport = shadow.querySelector(".button-report");
			const buttonCancel = shadow.querySelector(".button-cancel");
			const messageComp = shadow.querySelector(".message-comp");

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

			// Inicializar Dropzone una vez
			this.initDropzone(shadow);
			buttonImg.addEventListener("click", (e) => {
				e.preventDefault();
				this.dropzone.hiddenFileInput.click(); // Abre el selector de archivos
			});

			//boton cancelar
			buttonCancel.addEventListener("click", (e) => {
				e.preventDefault();
				if (isLogin) {
					Router.go("/mis-reports");
				} else {
					Router.go("/login");
				}
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
				const name = shadow
					.querySelector(".input-nombre")
					.shadowRoot.querySelector("input").value;
				const imgUrl = shadow.querySelector(".img").src;
				if (!name || !lat || !lng || !imgUrl || imgUrl == imagen)
					return console.log(
						"Faltan campos por completar, todos los campos son obligatorios"
					);
				if (isLogin) {
					newReport(name, imgUrl, lat, lng);
				} else {
					Router.go("/login");
				}
			});
			async function newReport(
				name: string,
				imgUrl: string,
				lat: number,
				lng: number
			) {
				try {
					const respuesta = await state.createPetReport(name, imgUrl, lat, lng);
					if (respuesta !== "ok") {
						messageComp.style.display = "inherit";
						messageComp.textContent =
							"Error al crear la publicacion, vuelve a intentarlo";
						setTimeout(() => {
							Router.go("/mis-reports");
						}, 3000);
						console.log("error al crear el reporte");
					} else {
						messageComp.style.display = "inherit";
						messageComp.textContent =
							"Mascota publicada, suerte con la busqueda!";
						setTimeout(() => {
							Router.go("/mis-reports");
						}, 3000);
					}
				} catch (error) {
					console.error("error del servidor al crear el reporte", error);
				}
			}
		}
		initDropzone(shadow) {
			const dropzzoneElement = shadow.querySelector(".dropzone-container");
			const previewImg = shadow.querySelector(".img");
			this.dropzone = new Dropzone(dropzzoneElement, {
				url: "/false",
				autoProcessQueue: false,
				dictDefaultMessage: "", // quita el texto por defecto
				previewsContainer: false, // evita que cree el contenedor de previews
				maxFiles: 1,
				thumbnail: function (file, dataUrl) {
					previewImg.src = dataUrl;
					previewImg.style.width = "100%";
					previewImg.style.height = "100%";
					previewImg.style.objectFit = "cover";
				},
			});
		}
	}
	customElements.define("report-page", ReportPage);
}
