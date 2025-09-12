import { state } from "../../state";
import { Router } from "@vaadin/router";
export function enterCodePage() {
	class EnterCodePage extends HTMLElement {
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
      <text-comp class="text-title" variant="title">Ingresar Código de Verificacion</text-comp>		
      <text-comp class="text-body" variant="subtitle">Ingresá el codigo de verificacion que enviamos a tu email.</text-comp>
      </div>
      <div class="form">
      <input-comp class="input-code" type="text">CÓDIGO</input-comp>
      <div class= "contador">Validez del código: 55</div>
      </div>
      <div class="buttons">
      <button-comp class="button-form" variant="blue">Enviar código</button-comp>
      <button-comp class="button-back" variant="gray">Volver a enviar el código</button-comp>
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
        .form{
          width: 100%;
          display:flex;
          flex-direction: column;
          gap:5px;
          }
          .buttons{
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
			timer();

			const inputCode = shadow.querySelector(".input-code");
			const messageComp = shadow.querySelector(".message-comp");
			const loadComp = shadow.querySelector(".load-comp");
			const dataContainer = shadow.querySelector(".data");
			const buttonForm = shadow.querySelector(".button-form");
			const buttonBack = shadow.querySelector(".button-back");
			buttonBack.addEventListener("click", (e) => {
				e.preventDefault();
				Router.go("/restore-pass");
			});

			buttonForm.addEventListener("click", async (e) => {
				e.preventDefault();
				const codigo = inputCode.shadowRoot.querySelector("input").value;
				dataContainer.style.filter = "blur(5px)";
				loadComp.style.display = "inherit";
				const response = await sendCode(codigo);
				if (response.status === "success") {
					Router.go("/pass");
				} else if (response.status === "warning") {
					dataContainer.style.filter = "none";
					loadComp.style.display = "none";
					messageComp.textContent = response.message;
					messageComp.style.display = "inherit";
					setTimeout(() => {
						Router.go("/restore-pass");
					}, 4000);
				} else {
					dataContainer.style.filter = "none";
					loadComp.style.display = "none";
					messageComp.textContent =
						"Error desconocido, intente nuevamente mas tarde";
					messageComp.style.display = "inherit";
					setTimeout(() => {
						state.logOut();
					}, 4000);
				}
			});
			async function sendCode(codigo: string) {
				try {
					const response = await state.sendCode(codigo); //hacer funcion en state/server/userController para obtener el codigo de verificacion
					return response;
				} catch (error) {
					console.error(
						"error en la funcion sendCode de la page enter-code",
						error
					);
					return { status: "error" };
				}
			}
			function timer() {
				let count = 55; // Duración del contador en segundos
				const timerDiv = shadow.querySelector(".contador");
				const startCountDown = () => {
					const updateCountDown = setInterval(() => {
						count--;
						timerDiv.textContent = `Validez del código: ${count.toString().padStart(2, "0")}`;
						if (count === 0) {
							clearInterval(updateCountDown); //detenemos el intervalo
							messageComp.textContent =
								"El tiempo de validez del código ha expirado, vuelve a solicitar uno nuevo";
							messageComp.style.display = "inherit";
							setTimeout(() => {
								Router.go("/restore-pass");
							}, 4000);
						}
					}, 1000);
				};
				startCountDown(); // Iniciar el contador
			}
		}
	}
	customElements.define("enter-code-page", EnterCodePage);
}
