import { Router } from "@vaadin/router";
import { state } from "../../state";
export function petLostPage() {
  class PetLostPage extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      const style = document.createElement("style");
      div.classList.add("home__container");
      const imagenEmptyReport = require("url:../../icons/icon-misReports.png");

      //esta info debe venir del state, por ahora sirve para maquetar
      const petsInfo = [
        { name: "beto", location: "cipolletti,rn", email: "beto@beto" },
        { name: "coki", location: "neuquen, nqn", email: "coki@coki" },
        { name: "uri", location: "plottier, nqn", email: "uri@uri" },
        { name: "micho", location: "allen, rn", email: "micho@micho" },
      ];
      div.innerHTML = `
      <div class="home-blur">
				<div class="home-title">
          <text-comp class="text-title" variant="subtitleBold">Mascotas perdidas cerca</text-comp>				
        </div>
				<div class="container-cards">
					${petsInfo
            .map((pet) => {
              return `<card-comp class="card"petName="${pet.name}" data-email="${pet.email}" petLocation="${pet.location}" petImgUrl ="" variant="report"></card-comp>`;
            })
            .join("")}
				</div>
				<div class="empty-report">
						<text-comp class="text-body" variant="text">No se encontraron mascotas, intenta ampliando el rango o con otra ubicación</text-comp>
						<img class="img" src="${imagenEmptyReport}">
				</div>
				<button-comp class="button-new-search" variant="blue">Nueva busqueda</button-comp>    
      </div> 
        <div class="form-report">
          <button class="close-button">X</button>
          <text-comp class="form-title" variant="title">Reportar info de una mascota</text-comp>
          <form class="form">
            <input-comp variant="black" class="form-nombre" name="nombre" >NOMBRE</input-comp>
            <input-comp variant="black" class="form-telefono" name="telefono">TELÉFONO</input-comp>
            <input-comp variant="black" class="form-ubicacion" name="ubicacion" height="131px">¿DÓNDE LO VISTE?</input-comp>
            <button-comp variant="green" class="form-button">Enviar información</button-comp>
          </form>
        </div>  

			`;
      style.innerHTML = `
      .home__container{
        height: 100%;
        max-width: 100%;
        margin:0;
        padding:0;
        padding-top:25px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap:40px;
      }
        .home-title{
        text-align: center;
        margin-bottom: 20px;
        }
      .container-cards{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px; /* Espacio entre las cards */
      }
      .form-report{
      display:none;
      width:314px;
      margin:0;
      padding: 25px 20px;
      background-color: #26302E;
      border-radius: 10px;
      flex-direction: column;
      gap:7px;
      position: fixed;
      z-index: 2;
      bottom: 50px;
      }
      .form-title{
      color:#FFFFFF;
      text-align: center;
      }
      .close-button{
			background-color: transparent;
			color: #fff;
			border: none;
			width: 16px;
			height: 16px;
			align-self: flex-end;
			font-size: 20px;
			}
     .form{
     display:flex;
     flex-direction: column;
     gap:25px;
     }
		.empty-report{
    	flex-direction: column;
    	gap:15px;
    	text-align: center;
    } 
    .img{
      width:305px;
      height:250px;
      margin-top:20px;
      margin-bottom:25px;
    }
		.button-new-search{
      margin-top:50px;
    }
      `;
      shadow.appendChild(div);
      shadow.appendChild(style);

      const emptyReport = shadow.querySelector(".empty-report");
      if (petsInfo.length > 0) {
        emptyReport.style.display = "none";
      } else {
        emptyReport.style.display = "flex";
      }
      const buttonNewSearch = shadow.querySelector(".button-new-search");
      buttonNewSearch.addEventListener("click", () => {
        Router.go("/share-loc");
      });

      const header = document.querySelector("header-comp");
      const form = shadow.querySelector(".form-report");
      const blurHome = shadow.querySelector(".home-blur");
      //si no lo hago asi, me toma el clik solo del primer card
      const reportButtons = shadow.querySelectorAll(".card");
      reportButtons.forEach((reportButton) => {
        reportButton.addEventListener("click", () => {
          form.style.display = "flex";
          blurHome.style.filter = "blur(5px)"; //difuminamos lo que queda atras
          blurHome.style.pointerEvents = "none"; //para que no se pueda clickear lo que queda atras
          header.style.filter = "blur(5px)"; //difuminamos el header
          header.style.pointerEvents = "none"; //para no poder clickear el header
        });
      });
      const closeButton = shadow.querySelector(".close-button");
      closeButton.addEventListener("click", () => {
        form.style.display = "none";
        blurHome.style.filter = "none";
        blurHome.style.pointerEvents = "auto";
        header.style.filter = "none";
        header.style.pointerEvents = "auto";
      });
      const formNombre = shadow.querySelector(".form-nombre ");
      const formTelefono = form.querySelector(".form-telefono");
      const formUbicacion = form.querySelector(".form-ubicacion");
      const formButton = shadow.querySelector(".form-button");
      formButton.addEventListener("click", (e) => {
        e.preventDefault();
        const nombre = formNombre.shadowRoot.querySelector("input").value;
        const telefono = formTelefono.shadowRoot.querySelector("input").value;
        const ubicacion = formUbicacion.shadowRoot.querySelector("input").value;
        console.log({ nombre, telefono, ubicacion });
        form.style.display = "none";
        blurHome.style.filter = "none";
        blurHome.style.pointerEvents = "auto";
        header.style.filter = "none";
        header.style.pointerEvents = "auto";
      });
    }
  }
  customElements.define("pet-lost-page", PetLostPage);
}
