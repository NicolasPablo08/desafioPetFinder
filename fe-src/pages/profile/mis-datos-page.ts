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
			<div class="datos">
				<div class="text">
					<text-comp class="text-title" variant="title">Datos</text-comp>
          <text-comp class="text-title" variant="title">personales</text-comp>
				</div>
				<form class="form">
        	<input-comp class="input-nombre" type="text">NOMBRE</input-comp>
					<input-comp class="input-localidad" type="text">LOCALIDAD</input-comp>
				</form>
				<button-comp class="button-form" variant="blue">Guardar</button-comp>
      </div>  
      <message-comp class="message-comp"></message-comp>

			`;
			style.innerHTML = `
      .container{
				box-sizing: border-box;
        height: calc(100vh - 60px);
        width: 100%;
        margin:0;
        padding:50px 20px 70px 20px;
        display: flex;
        justify-content: center;
      }
			.datos{
			max-width: 550px;
				height: 100%;
				display:flex;
				flex-direction: column;
				justify-content: space-between
			}
      .text{
        text-align: center;
      }
      .form{
        width: 100%;
        display:flex;
        flex-direction: column;
        gap:40px;
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
			shadow.appendChild(div);
			shadow.appendChild(style);

			//chequeamos que estamos logueados
			const isLogin = state.checkLogin();

			const inputNombre = shadow.querySelector(".input-nombre");
			const inputLocalidad = shadow.querySelector(".input-localidad");
			const messageComp = shadow.querySelector(".message-comp");

			const buttonForm = shadow.querySelector(".button-form");
			buttonForm.addEventListener("click", (e) => {
				e.preventDefault();
				const nombre = inputNombre.shadowRoot.querySelector("input").value;
				const localidad =
					inputLocalidad.shadowRoot.querySelector("input").value;
				if (isLogin) {
					guardar(nombre, localidad);
				} else {
					state.logOut();
				}
			});
			async function guardar(nombre: string, localidad: string) {
				try {
					const respuesta = await state.setDatesUser(nombre, localidad);
					if (respuesta === "ok") {
						messageComp.style.display = "inherit";
						messageComp.textContent = "Datos actualizados!";
						setTimeout(() => {
							Router.go("/perfil");
						}, 3000);
					}
				} catch (error) {
					console.error("error al guardar", error);
				}
			}
		}
	} //guardar debe llevar a /perfil
	customElements.define("mis-datos-page", DataPage);
}
