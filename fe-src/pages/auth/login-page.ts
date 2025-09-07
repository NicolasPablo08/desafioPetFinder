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
      <div class="login">
				<div class="text">
					<text-comp class="text-title" variant="title">Iniciar Sesión</text-comp>		
					<text-comp class="text-body" variant="subtitle">Ingresá los siguientes datos para iniciar sesión</text-comp>
				</div>
				<div class="form">
        	<input-comp class="input-email" type="email">EMAIL</input-comp>
					<input-comp class="input-pass" type="password">CONTRASEÑA</input-comp>
        </div>
        <div class="links">
          <a class="text-footer" href=""> Olvidé mi contraseña</a>
          <div class="inint-regist">
            <text-comp  variant="text">Aun no tenés cuenta?</text-comp> 
            <a class="text-footer" href="./regist"> Registrate</a>
          </div>
        </div>  
					<button-comp class="button-form" variant="blue">Acceder</button-comp>
      </div>  
        <message-comp class="message-comp"></message-comp>
			`;
			style.innerHTML = `
      .container{
        box-sizing: border-box;
        height: calc(100vh - 60px);
        width: 100%;
        margin:0;
        padding:40px 20px 70px 20px;
        display: flex;
        justify-content: center;
        position: relative;
      }
      .login{
        max-width: 550px;	
        height: 100%;
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
       .links{
        display:flex;
        flex-direction: column;
        gap:25px;
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

			const inputEmail = shadow.querySelector(".input-email");
			const inputPass = shadow.querySelector(".input-pass");
			const messageComp = shadow.querySelector(".message-comp");

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
						messageComp.style.display = "inherit";
						messageComp.textContent =
							"El email ingresado no se encuentra registrado!";
						inputEmail.shadowRoot.querySelector("input").value = "";
						inputPass.shadowRoot.querySelector("input").value = "";
						setTimeout(() => {
							messageComp.style.display = "none";
						}, 4000);
					} else if (respuesta === "password incorrecto") {
						messageComp.style.display = "inherit";
						messageComp.textContent = "La contraseña ingresada es incorrecta!";
						inputEmail.shadowRoot.querySelector("input").value = "";
						inputPass.shadowRoot.querySelector("input").value = "";
						setTimeout(() => {
							messageComp.style.display = "none";
						}, 4000); //para que el cartel este 3 segundos y desaparezca
					} //tal ves crear un else general que genere una ventana con "credenciales incorrectas" o "vuelve a intentar mas tarde"
				} catch (error) {
					console.error("error en login", error);
				}
			}
		}
	}
	customElements.define("login-page", LoginPage);
}
