export function dataPage() {
	class DataPage extends HTMLElement {
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
					<text-comp class="text-title" variant="title">Datos</text-comp>
          <text-comp class="text-title" variant="title">personales</text-comp>
				</div>
				<form class="form">
        	<input-comp class="input-nombre" type="text">NOMBRE</input-comp>
					<input-comp class="input-localidad" type="text">LOCALIDAD</input-comp>
					<button-comp class="button-form" variant="blue">Guardar</button-comp>
				</form>
        
			`;
			style.innerHTML = `
      .container{
        height: 100%;
        max-width: 100%;
        margin:0;
        padding:50px 20px 0 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap:100px;
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

			const inputNombre = shadow.querySelector(".input-nombre");
			const inputLocalidad = shadow.querySelector(".input-localidad");

			const buttonForm = shadow.querySelector(".button-form");
			buttonForm.addEventListener("click", (e) => {
				e.preventDefault();
				const nombre = inputNombre.shadowRoot.querySelector("input").value;
				const localidad =
					inputLocalidad.shadowRoot.querySelector("input").value;
				console.log({ nombre, localidad });
			});
		}
	}
	customElements.define("mis-datos-page", DataPage);
}
