import { Router } from "@vaadin/router";
import { state } from "../../state";
export function homePage() {
  class HomePage extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      const style = document.createElement("style");
      const imageSrc = require("url:../../icons/icon-home.png");
      div.classList.add("home__container");
      div.innerHTML = `
			<div class="home">
				<div class="home-img">
					<img class="img" src="${imageSrc}">
				</div>
				<div class="home-text">
					<text-comp class="text-title" variant="title">Pet Finder APP</text-comp>		
					<text-comp class="text-body" variant="subtitle">Encontrá y reportá mascotas perdidas cerca de tu ubicación</text-comp>
				</div>
				<div class="home-buttons">
					<button-comp class="button-ubication" variant="blue">Ver mascotas perdidas cerca</button-comp>
					<button-comp class="button-login" variant="green">Inicia sesión, para reportar</button-comp>
				</div>
			</div>	
			`;
      style.innerHTML = `
      .home__container{
				box-sizing: border-box;
				min-height:calc(100vh - 60px);
        max-width: 100%;
        margin:0;
        padding:40px 20px 70px 20px;
				display: flex;
				justify-content: center;
				}
				.home{
					max-width: 550px;				
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-between;
				
				}
      .img{
        margin:0;
        padding:0;
        width:215px;
        height:235px;
      }
      .home-text{
        text-align: center;
        display: flex;
        flex-direction: column;
        gap:20px;
      }
      .text-title{
      color:#EB6372;
      }
      .home-buttons{
      display: flex;
			width: 100%;
      flex-direction: column;
      gap:22px;
      } 
      `;
      shadow.appendChild(div);
      shadow.appendChild(style);

      //chequea si estamos logueados o no
      const isLogin = state.checkLogin();

      const buttonUbication = shadow.querySelector(".button-ubication");
      buttonUbication.addEventListener("click", () => {
        Router.go("/share-loc");
      });
      const buttonLogin = shadow.querySelector(".button-login");
      buttonLogin.addEventListener("click", () => {
        if (isLogin) {
          Router.go("/perfil");
        } else {
          Router.go("/login");
        }
      });
    }
  }
  customElements.define("home-page", HomePage);
}
