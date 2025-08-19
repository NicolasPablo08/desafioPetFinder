import { Router } from "@vaadin/router";
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
			div.innerHTML = `
				<div class="text">
					<text-comp class="text-title" variant="title">Mis datos</text-comp>		
				</div>
				<div class="buttons">
					<button-comp class="button-datos" variant="blue">Modificar datos personales</button-comp>
					<button-comp class="button-pass" variant="blue">Modificar contraseña</button-comp>
					<button-comp class="button-pets" variant="blue">Mis reportes</button-comp>
				</div>
        <div class="footer">
					<text-comp class="text-email" variant="text">miEmail@gmail.com</text-comp>
          <text-comp class="text-link" variant="link">Cerrar sesión</text-comp>		
				</div>
			`;
			style.innerHTML = `
      .container{
        height: 100%;
        max-width: 100%;
        margin:0;
        padding:50px 53px 0 53px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap:100px;
      }
      .text{
        text-align: center;
      }
      .buttons{
      display: flex;
      flex-direction: column;
      gap:20px;
      }
      .footer{
      display: flex;
      flex-direction: column;
      gap:15px;
      text-align: center;
      } 
      `;
			shadow.appendChild(div);
			shadow.appendChild(style);
			const buttonDatos = shadow.querySelector(".button-datos");
			const buttonPass = shadow.querySelector(".button-pass");
			const buttonPets = shadow.querySelector(".button-pets");

			buttonDatos.addEventListener("click", () => {
				Router.go("/datos");
			});
			buttonPass.addEventListener("click", () => {
				Router.go("/pass");
			});
			buttonPets.addEventListener("click", () => {
				Router.go("/mis-reports");
			});
		}
	}
	customElements.define("perfil-page", PerfilPage);
}
