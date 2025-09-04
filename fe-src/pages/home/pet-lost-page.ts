import { Router } from "@vaadin/router";
import { state } from "../../state";
import { getCiudadProvincia } from "../../lib/map";
export function petLostPage() {
	class PetLostPage extends HTMLElement {
		constructor() {
			super();
			this.render();
		}
		async render() {
			const shadow = this.attachShadow({ mode: "open" });
			const div = document.createElement("div");
			const style = document.createElement("style");
			div.classList.add("home__container");
			const imagenEmptyReport = require("url:../../icons/icon-misReports.png");

			//esta info debe venir del state, por ahora sirve para maquetar
			const petsInfo = state.getState().allPetsLost;
			const petsWithLocation = await Promise.all(
				petsInfo.map(async (pet) => {
					const ubicacion = await getCiudadProvincia(pet.lat, pet.lng);
					return { ...pet, ubicacion }; // Agregamos la ubicación al objeto de la mascota
				})
			);
			div.innerHTML = `
      <div class="home-blur">
				<div class="all-content">
          <text-comp class="text-title" variant="title">Mascotas perdidas</text-comp>				
					<div class="container-cards">
						${petsWithLocation
							.map((pet) => {
								return `<card-comp class="card"petName="${pet.name}" data-email="${pet.userEmail}" petLocation="${pet.ubicacion}" petImgUrl ="${pet.imgUrl}" variant="report"></card-comp>`;
							})
							.join("")}
					</div>
					<div class="empty-report">
						<text-comp class="text-body" variant="subtitle">No se encontraron mascotas, intenta ampliando el rango o con otra ubicación</text-comp>
						<img class="img" src="${imagenEmptyReport}">
					</div>
					<button-comp class="button-search" variant="blue">Nueva busqueda</button-comp>    
      	</div> 
			</div>	
        <div class="form-report">
          <button class="close-button">X</button>
          <text-comp class="form-title" variant="title">Reportar info de una mascota</text-comp>
          <form class="form">
            <input-comp variant="black" class="form-nombre" name="nombre" >NOMBRE</input-comp>
            <input-comp variant="black" class="form-telefono" name="telefono">TELEFONO</input-comp>
            <input-comp variant="black" class="form-info" name="info" height="131px">¿DÓNDE LO VISTE?</input-comp>
            <button-comp variant="green" class="form-button">Enviar información</button-comp>
          </form>
        </div>  

			`;
			style.innerHTML = `
      .home__container{
				box-sizing: border-box;
        min-height: calc(100vh - 60px);
        width: 100%;
        margin:0;
        padding:40px 20px 70px 20px;
        display: flex;
        justify-content: center;
      }
        .text-title{
				max-width: 550px;
        text-align: center;
        }
			.all-content{
				box-sizing: border-box;
				height: 100%;
				width: 100%;
				display:flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
			}	
      .container-cards{
        display: none;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px; /* Espacio entre las cards */
				padding-top:30px;
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
			max-width: 550px;
    	flex-direction: column;
    	gap:10px;
			align-items: center;
			text-align: center;
   	} 
    .img{
      width:270px;
      height:200px;
      margin-top:20px;
      margin-bottom:25px;
    }
		.button-search{
			max-width: 550px;
			width:100%;
      margin-top:20px;
    }
      `;
			shadow.appendChild(div);
			shadow.appendChild(style);

			const homeContainer = shadow.querySelector(".home__container");
			const containerCards = shadow.querySelector(".container-cards");
			const emptyReport = shadow.querySelector(".empty-report");
			if (petsInfo.length > 0) {
				emptyReport.style.display = "none";
				containerCards.style.display = "flex";
			} else {
				emptyReport.style.display = "flex";
			}
			const buttonNewSearch = shadow.querySelector(".button-search");
			buttonNewSearch.addEventListener("click", () => {
				Router.go("/share-loc");
			});

			const header = document.querySelector("header-comp");
			const form = shadow.querySelector(".form-report");
			const blurHome = shadow.querySelector(".home-blur");
			//si no lo hago asi, me toma el clik solo del primer card
			const reportButtons = shadow.querySelectorAll(".card");
			let userEmail;
			let namePet;
			reportButtons.forEach((reportButton) => {
				reportButton.addEventListener("click", () => {
					form.style.display = "flex";
					blurHome.style.filter = "blur(5px)"; //difuminamos lo que queda atras
					blurHome.style.pointerEvents = "none"; //para que no se pueda clickear lo que queda atras
					header.style.filter = "blur(5px)"; //difuminamos el header
					header.style.pointerEvents = "none"; //para no poder clickear el header
					userEmail = reportButton.getAttribute("data-email");
					namePet = reportButton.getAttribute("petName");
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
			const formInformacion = form.querySelector(".form-info");
			const formButton = shadow.querySelector(".form-button");
			formButton.addEventListener("click", async (e) => {
				e.preventDefault();
				const nombre = formNombre.shadowRoot.querySelector("input").value;
				const telefono = formTelefono.shadowRoot.querySelector("input").value;
				const informacion =
					formInformacion.shadowRoot.querySelector("input").value;
				const send = await state.sendEmail(
					nombre,
					userEmail,
					telefono,
					informacion,
					namePet
				);
				if (send == "ok") {
					console.log("email enviado");
				}

				//limpiamos el formulario
				formNombre.shadowRoot.querySelector("input").value = "";
				formTelefono.shadowRoot.querySelector("input").value = "";
				formInformacion.shadowRoot.querySelector("input").value = "";
				//sacamos el formulario y dejamos de difuminar
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
