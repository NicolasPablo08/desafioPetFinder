import { Router } from "@vaadin/router";
import { state } from "../state";
export function perfilPage() {
	class PerfilPage extends HTMLElement {
		constructor() {
			super();
			this.render();
		}
		render() {
			const shadow = this.attachShadow({ mode: "open" });
			const div = document.createElement("div");
			const style = document.createElement("style");
			div.classList.add("container");
			const email = state.getState().user.email;
			div.innerHTML = `
			<div class="datos">
				<div class="text">
					<text-comp class="text-title" variant="title">Mis datos</text-comp>		
				</div>
				<div class="buttons">
					<button-comp class="button-datos" variant="blue">Modificar datos personales</button-comp>
					<button-comp class="button-pass" variant="blue">Modificar contraseña</button-comp>
					<button-comp class="button-pets" variant="green">Mis reportes</button-comp>
				</div>
        <div class="footer">
					<text-comp class="text-email" variant="text">${email || "miEmail@gmail.com"}</text-comp>
          <text-comp class="text-link" variant="link">Cerrar sesión</text-comp>		
				</div>
			</div>	
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
				justify-content: space-between;
			}
      .text{
        text-align: center;
      }
      .buttons{
      display: flex;
      flex-direction: column;
      gap:40px;
      }
      .footer{
      display: flex;
      flex-direction: column;
      gap:30px;
      text-align: center;
      } 
      `;
			shadow.appendChild(div);
			shadow.appendChild(style);

			//chequeo si estoy logueado
			const isLogin = state.checkLogin();

			const buttonDatos = shadow.querySelector(".button-datos");
			const buttonPass = shadow.querySelector(".button-pass");
			const buttonPets = shadow.querySelector(".button-pets");
			const linkLogOut = shadow.querySelector(".text-link");
			linkLogOut.addEventListener("click", () => {
				state.logOut();
			});

			buttonDatos.addEventListener("click", () => {
				if (isLogin) {
					Router.go("/data");
				} else {
					state.logOut();
				}
			});
			buttonPass.addEventListener("click", () => {
				if (isLogin) {
					Router.go("/pass");
				} else {
					state.logOut();
				}
			});
			buttonPets.addEventListener("click", () => {
				if (isLogin) {
					Router.go("/my-reports");
				} else {
					state.logOut();
				}
			});
		}
	}
	customElements.define("perfil-page", PerfilPage);
}
