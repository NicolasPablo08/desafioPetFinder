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
        	<input-comp class="input-pass" type="text">CONTRASEÑA</input-comp>
					<input-comp class="input-confirm" type="text">CONFIRMAR CONTRASEÑA</input-comp>
				</div>
					<button-comp class="button-form" variant="blue">Guardar</button-comp>
			</div>	
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
      
				.pass-act, .error-pass, .error-gral{
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
        const confirmPassword = confirmPasswordEl.shadowRoot.querySelector("input").value;
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
