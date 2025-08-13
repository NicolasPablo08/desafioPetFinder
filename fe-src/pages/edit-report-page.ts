export function editReportPage() {
	class EditReportPage extends HTMLElement {
		constructor() {
			super();
			this.render();
		}
		render() {
			const shadow = this.attachShadow({ mode: "open" });
			const div = document.createElement("div");
			const style = document.createElement("style");
			div.classList.add("container");
			const imagen = require("url:../icons/icon-img.png");
			div.innerHTML = `
				<div class="text">
					<text-comp class="text-title" variant="title">Editar reporte de mascota</text-comp>		
				</div>
				<form class="form">
        	<input-comp class="input-nombre" type="text">Nombre</input-comp>
          <img class="img" src="${imagen}">
					<button-comp class="button-img" variant="blue">Modificar foto</button-comp>
          <div class="mapa"></div>
          <text-comp class="text-body" variant="text">Buscá un punto de referencia para reportar la mascota. Por ejemplo, la ubicación donde lo viste por última vez</text-comp>
          <input-comp class="input-ubicacion" type="text">Ubicación</input-comp>
          <button-comp class="button-guardar" variant="blue">Guardar</button-comp>
          <button-comp class="button-report" variant="green">Reportar como encontrado</button-comp>
          <button-comp class="button-delete" variant="red">Eliminar reporte</button-comp>
				</form>
        
			`;
			style.innerHTML = `
      .container{
        height: 100%;
        max-width: 100%;
        margin:0;
        padding:40px 20px 60px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap:90px;
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
      .img{
        width:335px;
        height:180px;  
      }
      .mapa{
        width: 335px;
        height:250px;
        margin-top:20px;
        background-color: #C4C4C4;  
      }
      .button-guardar{
        margin-top:20px;
      }
      `;
			shadow.appendChild(div);
			shadow.appendChild(style);

			// const inputEmail = shadow.querySelector(".input-email");
			// const inputPass = shadow.querySelector(".input-pass");

			// const buttonForm = shadow.querySelector(".button-form");
			// buttonForm.addEventListener("click", (e) => {
			// 	e.preventDefault();
			// 	const email = inputEmail.shadowRoot.querySelector("input").value;
			// 	const password = inputPass.shadowRoot.querySelector("input").value;
			// 	console.log({ email, password });
			// });
		}
	}
	customElements.define("edit-report-page", EditReportPage);
}
