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
          <a class="text-footer" href="/inicio"> Olvidé mi contraseña</a>
					<button-comp class="button-form" variant="blue">Acceder</button-comp>
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
        gap:100px;
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
        .button-form{
        margin-top: 80px;
        }
      `;
      shadow.appendChild(div);
      shadow.appendChild(style);

      const inputEmail = shadow.querySelector(".input-email");
      const inputPass = shadow.querySelector(".input-pass");

      const buttonForm = shadow.querySelector(".button-form");
      buttonForm.addEventListener("click", (e) => {
        e.preventDefault();
        const email = inputEmail.shadowRoot.querySelector("input").value;
        const password = inputPass.shadowRoot.querySelector("input").value;
        console.log({ email, password });
      });
    }
  }
  customElements.define("login-page", LoginPage);
}
