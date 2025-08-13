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
      `;
			shadow.appendChild(div);
			shadow.appendChild(style);

			const passwordEl = shadow.querySelector(".input-pass");
			const confirmPasswordEl = shadow.querySelector(".input-confirm");

			const buttonForm = shadow.querySelector(".button-form");
			buttonForm.addEventListener("click", (e) => {
				e.preventDefault();
				const password = passwordEl.shadowRoot.querySelector("input").value;
				const confirmPassword =
					confirmPasswordEl.shadowRoot.querySelector("input").value;
				console.log({ password, confirmPassword });
			});
		}
	}
	customElements.define("mi-pass-page", PassPage);
}
