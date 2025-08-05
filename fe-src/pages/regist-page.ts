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
				<div class="text">
					<text-comp class="text-title" variant="title">Iniciar Sesión</text-comp>		
					<text-comp class="text-body" variant="text">Ingresá los siguientes datos para realizar el registro</text-comp>
				</div>
				<form class="form">
        	<input-comp class="input-email" type="email">EMAIL</input-comp>
					<input-comp class="input-pass" type="password">CONTRASEÑA</input-comp>
          <input-comp class="input-pass-confirm" type="password">CONFIRMAR CONTRASEÑA</input-comp>
          <div class="link">
            <text-comp class="text-footer" variant="text">ya tenés cuenta?</text-comp> 
            <a class="text-link" href="/inicio"> Iniciar sesión</a>
          </div>
					<button-comp class="button-form" variant="blue">Siguiente</button-comp>
				</form>
        
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
        gap:80px;
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
        .button-form{
        margin-top: 20px;
        }
      `;
      shadow.appendChild(div);
      shadow.appendChild(style);

      const inputEmail = shadow.querySelector(".input-email");
      const inputPass = shadow.querySelector(".input-pass");
      const inputPassConfirm = shadow.querySelector(".input-pass-confirm");

      const buttonForm = shadow.querySelector(".button-form");
      buttonForm.addEventListener("click", (e) => {
        e.preventDefault();
        const email = inputEmail.shadowRoot.querySelector("input").value;
        const password = inputPass.shadowRoot.querySelector("input").value;
        const passwordConfirm = inputPassConfirm.shadowRoot.querySelector("input").value;
        console.log({ email, password, passwordConfirm });
      });
    }
  }
  customElements.define("regist-page", RegistPage);
}
