import { state } from "../../state";
import { Router } from "@vaadin/router";
export function loginPage() {
	class LoginPage extends HTMLElement {
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
					<text-comp class="text-title" variant="title">Iniciar Sesión</text-comp>		
					<text-comp class="text-body" variant="text">Ingresá los siguientes datos para iniciar sesión</text-comp>
				</div>
				<form class="form">
        	<input-comp class="input-email" type="email">EMAIL</input-comp>
					<input-comp class="input-pass" type="password">CONTRASEÑA</input-comp>
          <a class="text-footer" href=""> Olvidé mi contraseña</a>
          <div class="inint-regist">
            <text-comp  variant="text">Aun no tenés cuenta?</text-comp> 
            <a class="text-footer" href="./regist"> Registrate</a>
          </div>
					<button-comp class="button-form" variant="blue">Acceder</button-comp>
				</form>
        <div class="error-email">
          <text-comp variant="subtitle">El email ingresado no se encuentra registrado!</text-comp>
        </div>
        <div class="error-pass">
          <text-comp variant="subtitle">Contraseña incorrecta!</text-comp>
        </div>
        
			`;
			style.innerHTML = `
      .container{
        height: 100%;
        max-width: 100%;
        margin:0;
        padding:40px 20px 0 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap:100px;
        position: relative;
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
       .text-footer{
        margin:0;
        color:#5A8FEC;
        text-decoration: none;
        font-size: 16px;
        font-weight: 400;
        font-family: "Roboto";
        text-align: center;
       }
        .inint-regist{
        display: flex;
        justify-content: center;
        gap:5px;
        
       } 
        .button-form{
        margin-top: 80px;
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
			const errorEmail = shadow.querySelector(".error-email");
			const errorPass = shadow.querySelector(".error-pass");

			const buttonForm = shadow.querySelector(".button-form");
			buttonForm.addEventListener("click", (e) => {
				e.preventDefault();
				const email = inputEmail.shadowRoot.querySelector("input").value;
				const password = inputPass.shadowRoot.querySelector("input").value;
				login(email, password);
			});
			async function login(email: string, password: string) {
				try {
					const respuesta = await state.logIn(email, password);
					if (respuesta === "ok") {
						Router.go("/perfil");
					} else if (respuesta === "email incorrecto") {
						errorEmail.style.display = "inherit";
						inputEmail.shadowRoot.querySelector("input").value = "";
						inputPass.shadowRoot.querySelector("input").value = "";
						setTimeout(() => {
							errorEmail.style.display = "none";
						}, 3000);
					} else if (respuesta === "password incorrecto") {
						errorPass.style.display = "inherit";
						inputEmail.shadowRoot.querySelector("input").value = "";
						inputPass.shadowRoot.querySelector("input").value = "";
						setTimeout(() => {
							errorPass.style.display = "none";
						}, 3000); //para que el cartel este 3 segundos y desaparezca
					} //tal ves crear un else general que genere una ventana con "credenciales incorrectas" o "vuelve a intentar mas tarde"
				} catch (error) {
					console.error("error en login", error);
				}
			}
		}
	}
	customElements.define("login-page", LoginPage);
}
