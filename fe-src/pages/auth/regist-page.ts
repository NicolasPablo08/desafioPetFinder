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
        <message-comp class="message-comp"></message-comp>
        <load-comp class="load-comp"></load-comp>
        
        
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
      .message-comp{
        display: none;
        position: fixed; /* Fija la posición en la pantalla */
        top: 50%; /* Centra verticalmente */
        left: 50%; /* Centra horizontalmente */
        transform: translate(-50%, -50%); /* Ajusta el centro */
        z-index: 999; /* Asegura que este por encima de otros elementos */
      }
      .load-comp{
        display: none;
        position: fixed; /* Fija la posición en la pantalla */
        top: 50%; /* Centra verticalmente */
        left: 50%; /* Centra horizontalmente */
        transform: translate(-50%, -50%); /* Ajusta el centro */
        z-index: 999;
      }    
      `;
      shadow.appendChild(div);
      shadow.appendChild(style);

      const inputEmail = shadow.querySelector(".input-email");
      const inputPass = shadow.querySelector(".input-pass");
      const inputPassConfirm = shadow.querySelector(".input-pass-confirm");
      const registContainer = shadow.querySelector(".regist");
      const loadComp = shadow.querySelector(".load-comp");
      const messageComp = shadow.querySelector(".message-comp");

      const buttonForm = shadow.querySelector(".button-form");
      buttonForm.addEventListener("click", (e) => {
        e.preventDefault();
        const email = inputEmail.shadowRoot.querySelector("input").value;
        const password = inputPass.shadowRoot.querySelector("input").value;
        const passwordConfirm = inputPassConfirm.shadowRoot.querySelector("input").value;
        if (password === passwordConfirm) {
          registUser(email, password);
        } else {
          messageComp.textContent = "Las contraseñas ingresadas deben ser iguales";
          messageComp.style.display = "inherit";
          setTimeout(() => {
            messageComp.style.display = "none";
          }, 3000); //para que el cartel este 3 segundos y desaparezca
        }
      });
      async function registUser(email: string, password: string) {
        registContainer.style.filter = "blur(5px)";
        loadComp.style.display = "inherit";
        try {
          const response = await state.createUser(email, password);
          if (response.status === "warning") {
            registContainer.style.filter = "none";
            loadComp.style.display = "none";
            messageComp.textContent = response.message;
            messageComp.style.display = "inherit";
            inputEmail.shadowRoot.querySelector("input").value = "";
            inputPass.shadowRoot.querySelector("input").value = "";
            inputPassConfirm.shadowRoot.querySelector("input").value = "";
            setTimeout(() => {
              messageComp.style.display = "none";
            }, 4000); //para que el cartel este 3 segundos y desaparezca
          } else if (response.status === "success") {
            registContainer.style.filter = "none";
            loadComp.style.display = "none";
            messageComp.textContent = response.message;
            messageComp.style.display = "inherit";
            setTimeout(() => {
              messageComp.style.display = "none";
              Router.go("/data");
            }, 4000); //para que el cartel este 3 segundos y desaparezca
          } else {
            registContainer.style.filter = "none";
            loadComp.style.display = "none";
            messageComp.textContent = "Error, vuelve a intentarlo mas tarde";
            messageComp.style.display = "inherit";
            setTimeout(() => {
              Router.go("/");
            }, 4000); //para que el cartel este 3 segundos y desaparezca
          }
        } catch (error) {
          console.error("error en la funcion registUser de la page regist", error);
          Router.go("/");
        }
      }
    }
  }
  customElements.define("regist-page", RegistPage);
}
