import { Router } from "@vaadin/router";
import { state } from "../../state";
import { error } from "console";
export function passPage() {
	class PassPage extends HTMLElement {
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
			<div class="pass">
				<div class="text">
					<text-comp class="text-title" variant="title">Contraseña</text-comp>
				</div>
				<div class="form">
        	<input-comp class="input-pass" type="password">CONTRASEÑA</input-comp>
					<input-comp class="input-confirm" type="password">CONFIRMAR CONTRASEÑA</input-comp>
				</div>
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
			.pass{
				max-width: 550px;
				height: 100%;
				display:flex;
				flex-direction: column;
				justify-content: space-between;
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

			//chequeamos que estemos logueados
			const isLogin = state.checkLogin();

			const passwordEl = shadow.querySelector(".input-pass");
			const confirmPasswordEl = shadow.querySelector(".input-confirm");
			const messageComp = shadow.querySelector(".message-comp");

			const buttonForm = shadow.querySelector(".button-form");
			buttonForm.addEventListener("click", (e) => {
				e.preventDefault();
				const password = passwordEl.shadowRoot.querySelector("input").value;
				const confirmPassword =
					confirmPasswordEl.shadowRoot.querySelector("input").value;
				if (password === confirmPassword) {
					if (isLogin) {
						changePass(password);
					} else {
						state.logOut();
					}
				} else {
					messageComp.style.display = "inherit";
					messageComp.textContent =
						"Las contraseñas ingresadas deben ser iguales!";
					passwordEl.shadowRoot.querySelector("input").value = "";
					confirmPasswordEl.shadowRoot.querySelector("input").value = "";
					setTimeout(() => {
						messageComp.style.display = "none";
					}, 3000);
				}
			});
			async function changePass(password: string) {
				try {
					const respuesta = await state.setNewPassword(password);
					if (respuesta === "ok") {
						messageComp.style.display = "inherit";
						messageComp.textContent =
							"Contraseña actualizada, vuelve a iniciar sesión!";
						setTimeout(() => {
							state.logOut();
						}, 3000);
					} else {
						messageComp.style.display = "inherit";
						messageComp.textContent =
							"Error al actualizar la contraseña, intenta mas tarde";
						setTimeout(() => {
							Router.go("/perfil");
						}, 3000);
					}
				} catch (error) {
					console.error("error al guardar la contraseña", error);
				}
			}
		}
	}
	customElements.define("mi-pass-page", PassPage);
}
