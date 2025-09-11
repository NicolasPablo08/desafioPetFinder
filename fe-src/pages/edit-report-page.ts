import { state } from "../state";
import { Router } from "@vaadin/router";
import { Dropzone } from "dropzone";
import { initMap, obtainCoords } from "../lib/map";
import "leaflet/dist/leaflet.css"; //importamos estilos propios de leaflet
import { log } from "console";
export function editReportPage() {
  class EditReportPage extends HTMLElement {
    dropzone: any;
    constructor() {
      super();
      this.dropzone = null; // Inicializar la variable para Dropzone
    }
    connectedCallback() {
      const pathName = Number(window.location.pathname.split("/")[2]);
      const petUser = state.getOneUserPet(pathName);
      this.render(petUser);
    }
    render(pet) {
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      const style = document.createElement("style");
      div.classList.add("container");
      const imagen = require("url:../icons/icon-img.png");
      div.innerHTML = `
			<div class= "report">
				<div class="text">
					<text-comp class="text-title" variant="title">Editar reporte de mascota</text-comp>		
				</div>
        <input-comp class="input-nombre" type="text">Nombre</input-comp>
        <div class="dropzone-container">
          <img class="img" src="${imagen}">
				  <button-comp class="button-img" variant="blue">Cambiar foto</button-comp>
        </div>
				<input-comp class="input-ubicacion" placeholder="Ubicacion + Enter..." type="text">Ubicación (por ej. Ciudad, provincia)</input-comp>
				<div class="container-mapa">
				  <text-comp class="text-body" variant="text">Pon un punto de referencia en el mapa, por ejemplo, la ubicación donde lo viste por última vez</text-comp>
          <div class="mapa"></div>
				</div>	
				<div class="buttons">
          <button-comp class="button-guardar" variant="blue">Guardar</button-comp>
          <button-comp class="button-delete" variant="red">Eliminar reporte</button-comp>
          <button-comp class="button-cancel" variant="gray">Cancelar</button-comp>
				</div>
			</div>
      <message-comp class="message-comp"></message-comp> 
			<load-comp class="load-comp"></load-comp>     
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
      }
      .dropzone-container{
				width:100%;
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
        border-radius: 10px;
        background-color: #C4C4C4;  
      }
      .buttons{
        margin-top:20px;
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
      //funcion para inicializar el mapa
      let map;
      const containerMap = div.querySelector(".mapa");
      if (containerMap) {
        map = initMap(containerMap, pet.lat, pet.lng);
      }

      //ponemos los valores predeterminados del pet en los inputs
      div.querySelector(".input-nombre").shadowRoot.querySelector("input").value = pet.name;
      //div.querySelector(".input-ubicacion").shadowRoot.querySelector("input").value = "cipo";
      div.querySelector(".img").src = pet.imgUrl;

      shadow.appendChild(div);
      shadow.appendChild(style);

      const buttonImg = shadow.querySelector(".button-img");
      const buttonGuardar = shadow.querySelector(".button-guardar");
      const buttonCancel = shadow.querySelector(".button-cancel");
      const buttonDelete = shadow.querySelector(".button-delete");
      const messageComp = shadow.querySelector(".message-comp");
      const loadComp = shadow.querySelector(".load-comp");
      const reportContainer = shadow.querySelector(".report");

      // Inicializar Dropzone una vez
      this.initDropzone(shadow);
      buttonImg.addEventListener("click", (e) => {
        e.preventDefault();
        this.dropzone.hiddenFileInput.click(); // Abre el selector de archivos
      });
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
      //cancelar y volver a mis reports
      buttonCancel.addEventListener("click", (e) => {
        e.preventDefault();
        Router.go("/my-reports");
      });
      //eliminar reporte
      buttonDelete.addEventListener("click", (e) => {
        e.preventDefault();
        deleteReport(pet.petId);
      });
      //editar reporte con todos los datos, obteniendo las coordenadas
      let lat = pet.lat;
      let lng = pet.lng;
      containerMap.addEventListener("location-selected", (e) => {
        lat = e.detail.lat;
        lng = e.detail.lng;
      });
      buttonGuardar.addEventListener("click", (e) => {
        e.preventDefault();
        const name = shadow.querySelector(".input-nombre").shadowRoot.querySelector("input").value;

        const imgUrl = shadow.querySelector(".img").src;
        if (!name || !lat || !lng || !imgUrl)
          return console.log("Faltan campos por completar, todos los campos son obligatorios");
        guardarCambios(pet.petId, name, lat, lng, imgUrl);
      });

      async function guardarCambios(
        petId: number,
        name: string,
        lat: number,
        lng: number,
        imgUrl: string
      ) {
        reportContainer.style.filter = "blur(5px)";
        loadComp.style.display = "inherit";
        try {
          const response = await state.editPetReport(name, imgUrl, lat, lng, petId);
          if (response.status === "success" || response.status === "warning") {
            reportContainer.style.filter = "none";
            loadComp.style.display = "none";
            messageComp.style.display = "inherit";
            messageComp.textContent = response.message;
            setTimeout(() => {
              Router.go("/my-reports");
            }, 4000);
          } else {
            reportContainer.style.filter = "none";
            loadComp.style.display = "none";
            messageComp.style.display = "inherit";
            messageComp.textContent = "Error al editar el reporte, intenta mas tarde!";
            setTimeout(() => {
              state.logOut();
            }, 4000);
          }
        } catch (error) {
          console.error("error del servidor al editar reporte", error);
        }
      }

      async function deleteReport(petId) {
        reportContainer.style.filter = "blur(5px)";
        loadComp.style.display = "inherit";
        try {
          const response = await state.deletePetReport(petId);
          if (response.status === "success" || response.status === "warning") {
            reportContainer.style.filter = "none";
            loadComp.style.display = "none";
            messageComp.style.display = "inherit";
            messageComp.textContent = response.message;
            setTimeout(() => {
              Router.go("/my-reports");
            }, 4000);
          } else {
            reportContainer.style.filter = "none";
            loadComp.style.display = "none";
            messageComp.style.display = "inherit";
            messageComp.textContent =
              "Error al eliminar el eliminar la publicacion, intenta mas tarde!";
            setTimeout(() => {
              state.logOut();
            }, 4000);
          }
        } catch (error) {
          console.error("error en la funcion deleteReport de la page report", error);
          state.logOut();
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
  customElements.define("edit-report-page", EditReportPage);
}
