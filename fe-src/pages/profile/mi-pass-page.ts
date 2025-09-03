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
				<div class="text">
					<text-comp class="text-title" variant="title">Contraseña</text-comp>
				</div>
				<form class="form">
        	<input-comp class="input-pass" type="text">CONTRASEÑA</input-comp>
					<input-comp class="input-confirm" type="text">CONFIRMAR CONTRASEÑA</input-comp>
					<button-comp class="button-form" variant="blue">Guardar</button-comp>
				</form>
        <div class="pass-act">
          <text-comp variant="subtitle">Contraseña actualizada!</text-comp>
        </div>
				<div class="error-pass">
          <text-comp variant="subtitle"> Las contraseñas deben ser iguales!</text-comp>
        </div>
				<div class="error-gral">
          <text-comp variant="subtitle"> No se pudo actualizar la contraseña, intenta mas tarde!</text-comp>
        </div>
			`;
			style.innerHTML = `
      .container{
        height: 100%;
        max-width: 100%;
        margin:0;
        padding:60px 20px 0 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap:110px;
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
				.datos-act, .error-pass, .error-gral{
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

			//chequeamos que estemos logueados
			const isLogin = state.checkLogin();

			const passwordEl = shadow.querySelector(".input-pass");
			const confirmPasswordEl = shadow.querySelector(".input-confirm");
			const passAct = shadow.querySelector(".pass-act");
			const errorPass = shadow.querySelector(".error-pass");
			const errorGral = shadow.querySelector(".error-gral");

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
						Router.go("/login");
					}
				} else {
					errorPass.style.display = "inherit";
					passwordEl.shadowRoot.querySelector("input").value = "";
					confirmPasswordEl.shadowRoot.querySelector("input").value = "";
					setTimeout(() => {
						errorPass.style.display = "none";
					}, 3000);
				}
			});
			async function changePass(password: string) {
				try {
					const respuesta = await state.setNewPassword(password);
					if (respuesta === "ok") {
						passAct.style.display = "inherit";
						setTimeout(() => {
							Router.go("/perfil");
						}, 2000);
					} else {
						errorGral.style.display = "inherit";
						setTimeout(() => {
							Router.go("/perfil");
						}, 2000);
					}
				} catch (error) {
					console.error("error al guardar la contraseña", error);
				}
			}
		}
	}
	customElements.define("mi-pass-page", PassPage);
}
