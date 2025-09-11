import { state } from "../../state";
import { Router } from "@vaadin/router";
export function enterEmailPage() {
  class EnterEmailPage extends HTMLElement {
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
      <div class="data">
        <div class="text">
          <text-comp class="text-title" variant="title">Restablecer Contraseña</text-comp>		
          <text-comp class="text-body" variant="subtitle">Ingresá tu email registrado, te enviaremos un codigo de verificacion para recuperar tu contraseña.</text-comp>
        </div>
          <input-comp class="input-email" type="email">EMAIL</input-comp>
        <div class="buttons">
          <button-comp class="button-form" variant="blue">Enviar código</button-comp>
          <button-comp class="button-back" variant="blue">Volver</button-comp>
        </div>  
      </div>  
        <message-comp class="message-comp"></message-comp>
        <load-comp class="load-comp"></load-comp>

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
      .data{
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
      .buttons{
        width: 100%;
        display:flex;
        flex-direction: column;
        gap:20px;
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
      const messageComp = shadow.querySelector(".message-comp");
      const loadComp = shadow.querySelector(".load-comp");
      const dataContainer = shadow.querySelector(".data");
      const buttonForm = shadow.querySelector(".button-form");
      const buttonBack = shadow.querySelector(".button-back");
      buttonBack.addEventListener("click", (e) => {
        e.preventDefault();
        Router.go("/login");
      });

      buttonForm.addEventListener("click", async (e) => {
        e.preventDefault();
        const email = inputEmail.shadowRoot.querySelector("input").value;
        dataContainer.style.filter = "blur(5px)";
        loadComp.style.display = "inherit";
        const response = await getCode(email);
        if (response.status === "success") {
          Router.go("/send-code");
        } else if (response.status === "warning") {
          dataContainer.style.filter = "none";
          loadComp.style.display = "none";
          messageComp.style.display = "inherit";
          messageComp.textContent = response.message;
          inputEmail.shadowRoot.querySelector("input").value = "";
          setTimeout(() => {
            messageComp.style.display = "none";
          }, 4000);
        } else {
          dataContainer.style.filter = "none";
          loadComp.style.display = "none";
          messageComp.style.display = "inherit";
          messageComp.textContent = "Hubo un error, intenta nuevamente mas tarde";
          setTimeout(() => {
            Router.go("/login");
          }, 4000);
        }
      });
      async function getCode(email: string) {
        try {
          const response = await state.getCode(email); //hacer funcion en state/server/userController para obtener el codigo de verificacion
          return response;
        } catch (error) {
          console.error("error en la funcion getCode de la page enter-email", error);
          return { status: "error" };
        }
      }
    }
  }
  customElements.define("enter-email-page", EnterEmailPage);
}
