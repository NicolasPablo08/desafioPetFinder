export function perfilPage() {
	class PerfilPage extends HTMLElement {
		constructor() {
			super();
			this.render();
		}
		render() {
			const shadow = this.attachShadow({ mode: "open" });
			const div = document.createElement("div");
			const style = document.createElement("style");
			const imageSrc = require("url:../icons/icon-home.png");
			div.classList.add("container");
			div.innerHTML = `
				<div class="text">
					<text-comp class="text-title" variant="title">Mis datos</text-comp>		
				</div>
				<div class="buttons">
					<button-comp class="button-ubication" variant="blue">Modificar datos personales</button-comp>
					<button-comp class="button-intructions" variant="blue">Modificar contraseña</button-comp>
				</div>
        <div class="footer">
					<text-comp class="text-email" variant="text">miEmail@gmail.com</text-comp>
          <text-comp class="text-link" variant="link">Cerrar sesión</text-comp>		
				</div>
			`;
			style.innerHTML = `
      .container{
        height: 100%;
        max-width: 100%;
        margin:0;
        padding:50px 53px 0 53px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap:150px;
      }
      .text{
        text-align: center;
      }
      .buttons{
      display: flex;
      flex-direction: column;
      gap:20px;
      }
      .footer{
      display: flex;
      flex-direction: column;
      gap:15px;
      text-align: center;
      } 
      `;
			shadow.appendChild(div);
			shadow.appendChild(style);
		}
	}
	customElements.define("perfil-page", PerfilPage);
}
