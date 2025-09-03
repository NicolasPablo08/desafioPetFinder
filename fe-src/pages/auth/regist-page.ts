import { Router } from "@vaadin/router";
import { state } from "../../state";
export function registPage() {
  class RegistPage extends HTMLElement {
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
			<div class="regist">
				<div class="text">
					<text-comp class="text-title" variant="title">Registrate</text-comp>		
					<text-comp class="text-body" variant="subtitle">Ingresá los siguientes datos para realizar el registro</text-comp>
				</div>
				<div class="form">
        	<input-comp class="input-email" type="email">EMAIL</input-comp>
					<input-comp class="input-pass" type="password">CONTRASEÑA</input-comp>
          <input-comp class="input-pass-confirm" type="password">CONFIRMAR CONTRASEÑA</input-comp>
				</div>
        <div class="link">
          <text-comp class="text-footer" variant="text">ya tenés cuenta?</text-comp> 
          <a class="text-link" href="/login"> Iniciar sesión</a>
        </div>
				<button-comp class="button-form" variant="blue">Siguiente</button-comp>
			</div>	
        <div class="error-email">
          <text-comp variant="subtitle">El email ingresado ya se encuentra registrado!</text-comp>
        </div>
        <div class="error-pass">
          <text-comp variant="subtitle"> Las contraseñas deben ser iguales!</text-comp>
        </div>
        
        
			`;
      style.innerHTML = `
      .container{
				box-sizing: border-box;
        height: calc(100vh - 60px);
        max-width: 100%;
        margin:0;
        padding:40px 20px 70px 20px;
        display: flex;
        justify-content: center;
      }
			.regist{
				height: 100%;
				max-width: 550px;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}
      .text{
        text-align: center;
        display: flex;
        flex-direction: column;
        gap:30px;
      }
      .form{
        width: 100%;
        display:flex;
        flex-direction: column;
        gap:30px;
      }
      .link{
        display:flex;
        justify-content: center;
        gap: 5px;
      }
      .text-link{
        margin:0;
        color:#5A8FEC;
        text-decoration: none;
        font-size: 16px;
        font-weight: 400;
        font-family: "Roboto";
        text-align: center;
      }
      
        .error-email, .error-pass{
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

      const inputEmail = shadow.querySelector(".input-email");
      const inputPass = shadow.querySelector(".input-pass");
      const inputPassConfirm = shadow.querySelector(".input-pass-confirm");
      const errorEmail = shadow.querySelector(".error-email");
      const errorPass = shadow.querySelector(".error-pass");

      const buttonForm = shadow.querySelector(".button-form");
      buttonForm.addEventListener("click", (e) => {
        e.preventDefault();
        const email = inputEmail.shadowRoot.querySelector("input").value;
        const password = inputPass.shadowRoot.querySelector("input").value;
        const passwordConfirm = inputPassConfirm.shadowRoot.querySelector("input").value;
        if (password === passwordConfirm) {
          registUser(email, password);
        } else {
          errorPass.style.display = "inherit";
          setTimeout(() => {
            errorPass.style.display = "none";
          }, 3000); //para que el cartel este 3 segundos y desaparezca
        }
      });
      async function registUser(email: string, password: string) {
        try {
          const respuesta = await state.createUser(email, password);
          if (respuesta === "email ya registrado") {
            errorEmail.style.display = "inherit";
            inputEmail.shadowRoot.querySelector("input").value = "";
            inputPass.shadowRoot.querySelector("input").value = "";
            inputPassConfirm.shadowRoot.querySelector("input").value = "";
            setTimeout(() => {
              errorEmail.style.display = "none";
            }, 3000); //para que el cartel este 3 segundos y desaparezca
          } else if (respuesta === "ok") {
            Router.go("/datos");
          }
        } catch (error) {
          console.error("error en login", error);
        }
      }
    }
  }
  customElements.define("regist-page", RegistPage);
}
