import { state } from "../state";
import { Router } from "@vaadin/router";
export function editReportPage() {
	class EditReportPage extends HTMLElement {
		constructor() {
			super();
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
				<div class="text">
					<text-comp class="text-title" variant="title">Editar reporte de mascota</text-comp>		
				</div>
				<form class="form">
        	<input-comp class="input-nombre" type="text">Nombre</input-comp>
          <img class="img" src="${imagen}">
					<button-comp class="button-img" variant="blue">Modificar foto</button-comp>
          <div class="mapa"></div>
          <text-comp class="text-body" variant="text">Buscá un punto de referencia para reportar la mascota. Por ejemplo, la ubicación donde lo viste por última vez</text-comp>
          <input-comp class="input-ubicacion" type="text">Ubicación</input-comp>
          <button-comp class="button-guardar" variant="blue">Guardar</button-comp>
          <button-comp class="button-cancel" variant="green">Cancelar</button-comp>
          <button-comp class="button-delete" variant="red">Eliminar reporte</button-comp>
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
      .img{
        width:335px;
        height:180px;  
      }
      .mapa{
        width: 335px;
        height:250px;
        margin-top:20px;
        background-color: #C4C4C4;  
      }
      .button-guardar{
        margin-top:20px;
      }
      `;

			div
				.querySelector(".input-nombre")
				.shadowRoot.querySelector("input").value = pet.name;
			div
				.querySelector(".input-ubicacion")
				.shadowRoot.querySelector("input").value = pet.location;
			div.querySelector(".img").src = pet.imageUrl;

			shadow.appendChild(div);
			shadow.appendChild(style);

			const buttonGuardar = shadow.querySelector(".button-guardar");
			const buttonCancel = shadow.querySelector(".button-cancel");
			const buttonDelete = shadow.querySelector(".button-delete");
			buttonCancel.addEventListener("click", (e) => {
				e.preventDefault();
				Router.go("/mis-reports");
			});
			buttonDelete.addEventListener("click", (e) => {
				e.preventDefault();
				deleteReport(pet.petId);
			});
			buttonGuardar.addEventListener("click", (e) => {
				e.preventDefault();
				const nombreValue = shadow
					.querySelector(".input-nombre")
					.shadowRoot.querySelector("input").value;
				const ubicacionValue = shadow
					.querySelector(".input-ubicacion")
					.shadowRoot.querySelector("input").value;
				const imgValue = shadow.querySelector(".img").src;
				guardarCambios(pet.petId, nombreValue, ubicacionValue, imgValue);
			});

			async function guardarCambios(
				petId: number,
				nombre: string,
				ubicacion: string,
				imgUrl: string
			) {
				try {
					const respuesta = await state.editPetReport(
						nombre,
						imgUrl,
						ubicacion,
						petId
					);
					if (respuesta !== "ok") {
						//aca
						console.log("error al editar reporte");
					} else {
						Router.go("/mis-reports");
					}
				} catch (error) {
					console.error("error al editar reporte", error);
				}
			}

			async function deleteReport(petId) {
				try {
					const respuesta = await state.deletePetReport(petId);
					if (respuesta !== "ok") {
						console.log("error al eliminar reporte");
					} else {
						Router.go("/mis-reports");
					}
				} catch (error) {
					console.error("error al eliminar reporte", error);
				}
			}

			// const buttonForm = shadow.querySelector(".button-form");
			// buttonForm.addEventListener("click", (e) => {
			// 	e.preventDefault();
			// 	const email = inputEmail.shadowRoot.querySelector("input").value;
			// 	const password = inputPass.shadowRoot.querySelector("input").value;
			// 	console.log({ email, password });
			// });
		}
	}
	customElements.define("edit-report-page", EditReportPage);
}
