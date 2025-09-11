import { state } from "../state";
import { Router } from "@vaadin/router";
import { getCiudadProvincia } from "../lib/map";
export function myReportsPage() {
  class MyReportsPage extends HTMLElement {
    constructor() {
      super();
      this.render();
    }

    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      const style = document.createElement("style");
      div.classList.add("container");
      const imagenEmptyReport = require("url:../icons/icon-misReports.png");

      //debo obtener la ubicacion en base a las coordenadas
      const allMyPets = state.getState().petsUser;

      div.innerHTML = `
			<div class="all-reports">
        <text-comp class="text-title" variant="subtitleBold">Mascotas reportadas</text-comp>
				<div class="container-cards">
					${allMyPets
            .map((pet) => {
              //agregamos el id como un dato dentro del card
              return `<card-comp class="card" data-id="${pet.petId}" petName="${pet.name}" petLocation="${pet.ubicacion}" petImgUrl ="${pet.imgUrl}" variant="edit"></card-comp>`;
            })
            .join("")}
				</div>
        <div class="empty-report">
            <text-comp class="text-body" variant="subtitle">Aún no reportaste mascotas perdidas</text-comp>
            <img class="img" src="${imagenEmptyReport}">
        </div>
        <button-comp class="button" variant="blue">Nuevo reporte</button-comp>
			</div>	    
            `;
      style.innerHTML = `
        .container{
				box-sizing: border-box;
        min-height: calc(100vh - 60px);
        width: 100%;
        padding:40px 20px 70px 20px;
        display: flex;
        justify-content: center;
        }
				.all-reports{
          box-sizing: border-box;
					width: 100%;
					height: 100%;
					display: flex;
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
        .empty-report{
					max-width: 550px;
          flex-direction: column;
          gap:10px;
          text-align: center;
					align-items: center;
        } 
        .img{
          width:270px;
          height:200px;
          margin-top:20px;
          margin-bottom:25px;
        }
        .button{
				max-width: 550px;
				width:100%;
				margin-top: 20px;
        }
      `;
      shadow.appendChild(div);
      shadow.appendChild(style);

      //verificamos si el usuario esta logueado
      const isLogin = state.checkLogin();

      const emptyReport = shadow.querySelector(".empty-report");
      const containerCards = shadow.querySelector(".container-cards");
      if (allMyPets.length > 0) {
        emptyReport.style.display = "none";
        containerCards.style.display = "flex";
      } else {
        emptyReport.style.display = "flex";
      }
      //si no lo hago asi, me toma el clik solo del primer card
      const editButtons = shadow.querySelectorAll(".card");
      editButtons.forEach((edit) => {
        edit.addEventListener("click", () => {
          const petId = edit.getAttribute("data-id"); // Obtener el ID de la mascota
          Router.go(`/edit-report/${petId}`); //enviamos el id dentro de la url
        });
      });
      const reportButton = shadow.querySelector(".button");
      reportButton.addEventListener("click", () => {
        if (isLogin) {
          Router.go("/report");
        } else {
          Router.go("/login");
        }
      });
    }
  }
  customElements.define("my-reports-page", MyReportsPage);
}
