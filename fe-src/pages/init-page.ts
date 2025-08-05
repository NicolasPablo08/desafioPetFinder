export function initPage() {
  class InitPage extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      const style = document.createElement("style");
      const imageSrc = require("url:../icons/icon-login.png");
      div.classList.add("init__container");
      div.innerHTML = `
				<div class="init-img">
					<img class="img" src="${imageSrc}">
				</div>
				<div class="init-text">
					<text-comp class="text-title" variant="title">Ingresar</text-comp>		
					<text-comp class="text-body" variant="text">Ingresá tu email para continuar.</text-comp>
				</div>
				<form class="init-form">
					<input-comp class="input-email" type="email">EMAIL</input-comp>
					<button-comp class="button-form" variant="blue">Siguiente</button-comp>
				</form>
        <div class="inint-regist">
          <text-comp class="text-footer" variant="text">Aun no tenés cuenta?</text-comp> 
          <a class="register-text" href=""> Registrate</a>
        </div>
			`;
      style.innerHTML = `
      .init__container{
        height: 100%;
        max-width: 100%;
        margin:0;
        padding:40px 20px 0 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap:25px;
      }
      .img{
        margin:0;
        padding:0;
        width:340px;
        height:205px;
      }
      .init-text{
        text-align: center;
        display: flex;
        flex-direction: column;
        gap:15px;
      }
      .init-form{
        width: 100%;
        display:flex;
        flex-direction: column;
        gap:20px;
      }
       .inint-regist{
        display: flex;
        align-items: center;
        gap:5px;
        
       } 
      .register-text{
      color:#5A8FEC;
      text-decoration: none;
      }  
      `;
      shadow.appendChild(div);
      shadow.appendChild(style);

      const form = shadow.querySelector(".init-form");
      const inputForm = shadow.querySelector(".input-email");
      const buttonForm = shadow.querySelector(".button-form");
      buttonForm.addEventListener("click", (e) => {
        e.preventDefault();
        const email = inputForm.shadowRoot.querySelector("input").value;
        console.log(email);
      });
    }
  }
  customElements.define("init-page", InitPage);
}
