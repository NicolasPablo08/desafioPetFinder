import { Router } from "@vaadin/router";
import { state } from "../../state";
export function dataPage() {
	class DataPage extends HTMLElement {
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
					<text-comp class="text-title" variant="title">Datos</text-comp>
          <text-comp class="text-title" variant="title">personales</text-comp>
				</div>
				<form class="form">
        	<input-comp class="input-nombre" type="text">NOMBRE</input-comp>
					<input-comp class="input-localidad" type="text">LOCALIDAD</input-comp>
					<button-comp class="button-form" variant="blue">Guardar</button-comp>
				</form>
				<div class="datos-act">
          <text-comp variant="subtitle">Datos actualizados!</text-comp>
        </div>
        
			`;
			style.innerHTML = `
      .container{
        height: 100%;
        max-width: 100%;
        margin:0;
        padding:50px 20px 0 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap:100px;
      }
  
      .text{
        text-align: center;
      }
      .form{
        width: 100%;
        display:flex;
        flex-direction: column;
        gap:20px;
      }
      .button-form{
        margin-top: 80px;
      }
				.datos-act{
          display: none;
          width: 300px;
          height:200px;
          text-align: center;
          align-items: center;
          position: absolute;
          background-color: white;
          border-radius: 10px;
          border:solid 2px black;
          top: 30%;
        }
      `;
			shadow.appendChild(div);
			shadow.appendChild(style);

			const inputNombre = shadow.querySelector(".input-nombre");
			const inputLocalidad = shadow.querySelector(".input-localidad");
			const datosAct = shadow.querySelector(".datos-act");

			const buttonForm = shadow.querySelector(".button-form");
			buttonForm.addEventListener("click", (e) => {
				e.preventDefault();
				const nombre = inputNombre.shadowRoot.querySelector("input").value;
				const localidad =
					inputLocalidad.shadowRoot.querySelector("input").value;
				guardar(nombre, localidad);
			});
			async function guardar(nombre: string, localidad: string) {
				try {
					const respuesta = await state.setDatesUser(nombre, localidad);
					if (respuesta === "ok") {
						datosAct.style.display = "inherit";
						setTimeout(() => {
							Router.go("/perfil");
						}, 2000);
					}
				} catch (error) {
					console.error("error al guardar", error);
				}
			}
		}
	} //guardar debe llevar a /perfil
	customElements.define("mis-datos-page", DataPage);
}
