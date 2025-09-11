import { Router } from "@vaadin/router";
import { state } from "../../state";
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
        	<input-comp class="input-pass" type="password" placeholder="******">CONTRASEÑA</input-comp>
					<input-comp class="input-confirm" type="password" placeholder="******">CONFIRMAR CONTRASEÑA</input-comp>
				</div>
					<button-comp class="button-form" variant="blue">Guardar</button-comp>
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

      //chequeamos que estemos logueados
      const isLogin = state.checkLogin();

      const passwordEl = shadow.querySelector(".input-pass");
      const confirmPasswordEl = shadow.querySelector(".input-confirm");
      const messageComp = shadow.querySelector(".message-comp");
      const loadComp = shadow.querySelector(".load-comp");
      const passContainer = shadow.querySelector(".pass");

      const buttonForm = shadow.querySelector(".button-form");
      buttonForm.addEventListener("click", (e) => {
        e.preventDefault();
        const password = passwordEl.shadowRoot.querySelector("input").value;
        const confirmPassword = confirmPasswordEl.shadowRoot.querySelector("input").value;
        if (password === confirmPassword) {
          if (isLogin) {
            changePass(password);
          } else {
            state.logOut();
          }
        } else {
          messageComp.style.display = "inherit";
          messageComp.textContent = "Las contraseñas ingresadas deben ser iguales!";
          passwordEl.shadowRoot.querySelector("input").value = "";
          confirmPasswordEl.shadowRoot.querySelector("input").value = "";
          setTimeout(() => {
            messageComp.style.display = "none";
          }, 3000);
        }
      });
      async function changePass(password: string) {
        passContainer.style.filter = "blur(5px)";
        loadComp.style.display = "inherit";
        try {
          const response = await state.setNewPassword(password);
          if (response.status === "success") {
            passContainer.style.filter = "none";
            loadComp.style.display = "none";
            messageComp.style.display = "inherit";
            messageComp.textContent = response.message;
            setTimeout(() => {
              state.logOut();
            }, 4000);
          } else {
            passContainer.style.filter = "none";
            loadComp.style.display = "none";
            messageComp.style.display = "inherit";
            messageComp.textContent = "Error al actualizar la contraseña, intenta mas tarde";
            setTimeout(() => {
              Router.go("/perfil");
            }, 4000);
          }
        } catch (error) {
          console.error("error en la funcion changePass de la page mis-pass", error);
          state.logOut();
        }
      }
    }
  }
  customElements.define("my-pass-page", PassPage);
}
