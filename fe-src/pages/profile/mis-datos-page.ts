import { Router } from "@vaadin/router";
import { state } from "../../state";
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
			<div class="datos">
				<div class="text">
					<text-comp class="text-title" variant="title">Datos</text-comp>
          <text-comp class="text-title" variant="title">personales</text-comp>
				</div>
				<form class="form">
        	<input-comp class="input-nombre" type="text">NOMBRE</input-comp>
					<input-comp class="input-localidad" type="text">LOCALIDAD</input-comp>
				</form>
				<button-comp class="button-form" variant="blue">Guardar</button-comp>
				<div class="datos-act">
          <text-comp variant="subtitle">Datos actualizados!</text-comp>
        </div>
      </div>  
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
			.datos{
			max-width: 550px;
				height: 100%;
				display:flex;
				flex-direction: column;
				justify-content: space-between
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
				.datos-act{
          display: none;
          width: 300px;
          height:200px;
          text-align: center;
          align-items: center;
          position: absolute;
          background-color: white;
          border-radius: 10px;
          border:solid 2px black;
          top: 30%;
        }
      `;
      shadow.appendChild(div);
      shadow.appendChild(style);

      //chequeamos que estamos logueados
      const isLogin = state.checkLogin();

      const inputNombre = shadow.querySelector(".input-nombre");
      const inputLocalidad = shadow.querySelector(".input-localidad");
      const datosAct = shadow.querySelector(".datos-act");

      const buttonForm = shadow.querySelector(".button-form");
      buttonForm.addEventListener("click", (e) => {
        e.preventDefault();
        const nombre = inputNombre.shadowRoot.querySelector("input").value;
        const localidad = inputLocalidad.shadowRoot.querySelector("input").value;
        if (isLogin) {
          guardar(nombre, localidad);
        } else {
          state.logOut();
        }
      });
      async function guardar(nombre: string, localidad: string) {
        try {
          const respuesta = await state.setDatesUser(nombre, localidad);
          if (respuesta === "ok") {
            datosAct.style.display = "inherit";
            setTimeout(() => {
              Router.go("/perfil");
            }, 2000);
          }
        } catch (error) {
          console.error("error al guardar", error);
        }
      }
    }
  } //guardar debe llevar a /perfil
  customElements.define("mis-datos-page", DataPage);
}
