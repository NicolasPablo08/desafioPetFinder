import { state } from "../state";
import { Router } from "@vaadin/router";
import { getCiudadProvincia } from "../lib/map";
export function misReportsPage() {
	class MisReportsPage extends HTMLElement {
		constructor() {
			super();
			this.render();
		}

		async render() {
			const shadow = this.attachShadow({ mode: "open" });
			const div = document.createElement("div");
			const style = document.createElement("style");
			div.classList.add("container");
			const imagenEmptyReport = require("url:../icons/icon-misReports.png");

			//debo obtener la ubicacion en base a las coordenadas
			const allMyPets = state.getState().petsUser;
			const petsWithLocation = await Promise.all(
				allMyPets.map(async (pet) => {
					const ubicacion = await getCiudadProvincia(pet.lat, pet.lng);
					return { ...pet, ubicacion }; // Agregamos la ubicación al objeto de la mascota
				})
			);
			div.innerHTML = `
        <div class="text">
          <text-comp class="text-title" variant="subtitleBold">Mascotas</text-comp>
          <text-comp class="text-title" variant="subtitleBold">reportadas</text-comp>							
        </div>
				<div class="container-cards">
					${petsWithLocation
						.map((pet) => {
							//agregamos el id como un dato dentro del card
							return `<card-comp class="card" data-id="${pet.petId}" petName="${pet.name}" petLocation="${pet.ubicacion}" petImgUrl ="${pet.imgUrl}" variant="edit"></card-comp>`;
						})
						.join("")}
				</div>
        <div class="empty-report">
            <text-comp class="text-body" variant="text">Aún no reportaste mascotas perdidas</text-comp>
            <img class="img" src="${imagenEmptyReport}">
        </div>
        <button-comp class="button" variant="blue">Nuevo reporte</button-comp>    
            `;
			style.innerHTML = `
        .container{
        height: 100%;
        max-width: 100%;
        padding-top:40px;
        padding-bottom:35px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap:20px;
        }
        .text{
          text-align: center;
          margin-bottom: 20px;
        }
        .container-cards{
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px; /* Espacio entre las cards */
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
        .button{
        margin-top:20px;
        }
      `;
			shadow.appendChild(div);
			shadow.appendChild(style);
			const emptyReport = shadow.querySelector(".empty-report");
			if (allMyPets.length > 0) {
				emptyReport.style.display = "none";
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
				Router.go("/report");
			});
		}
	}
	customElements.define("mis-reports-page", MisReportsPage);
}
