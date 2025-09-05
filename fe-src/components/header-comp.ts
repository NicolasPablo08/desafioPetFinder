import { state } from "../state";
import { Router } from "@vaadin/router";
export function headerComp() {
	class HeaderComp extends HTMLElement {
		shadow: ShadowRoot;
		constructor() {
			super();
			this.shadow = this.attachShadow({ mode: "open" });
		}
		connectedCallback() {
			this.render();
			state.subscribe(() => {
				this.render();
			});
		}
		render() {
			this.shadow.innerHTML = ""; // Limpiar contenido anterior
			const div = document.createElement("div");
			div.classList.add("header-container");
			const style = document.createElement("style");
			const imageSrc = require("url:../icons/icon-header.png");
			const userMail = state.getState().user.email || "emailDelUser@gmail.com"; //remplazar con el email del usuario logueado
			div.innerHTML = `
			<div class= "header__logo-container">
				<img class="logo" src=${imageSrc} alt="">
			</div>
			<div class ="header__menu-container">
				<button class="menu__button-open"><h3 class="icon-menu-open">☰</h3></button>
			</div>	
			<div class="menu-window">
				<button class="menu__button-close">	X </button>
				<div class="menu-options">
					<div class="loged">
						<a	href="/perfil" class="option-dates text"> Mi perfil</a> 
						<a	href="/report" class="option-report text"> Reportar mascota</a>
						<a	href="/mis-reports" class="option-my-reports text"> Mis mascotas <br> reportadas</a>
					</div>
					<div class="not-loged">
						<a	href="/" class="option-home text"> Home</a> 
						<a	href="/share-loc" class="option-search text"> Ver mascotas <br> perdidas cerca</a>
						<a	href="/login" class="option-login text"> Iniciar Sesión</a>
						<a	href="/regist" class="option-regist text"> Registrate</a>
					</div>	
				</div>
				<div class="option-footer">
					<text-comp class="option-contact" variant="text">${userMail}</text-comp>
					<a href="" class="option-logout">CERRAR SESIÓN</a>	
				</div>	
			</div>	
			`;
			style.innerHTML = `
			.header-container {
			padding: 0 20px;
			max-width: 100%;
			height: 60px;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			background-color: #26302E;
			border-radius: 0 0 10px 10px;
			position: relative;

			}
			.logo{
				width: 40px;
				height: 40px;
				margin:0;
			}
			.menu__button-open{
				padding: 0;
				margin:0;
				width: 24px;
				height: 24px;
				background-color: transparent;
				color: #fff;
				border: none;
			}
			.icon-menu-open{
				margin:0;
				padding: 0;
				font-size: 20px;
				position: relative;
				bottom: 5px;
			}
			.menu-window{
			box-sizing: border-box;
			padding: 25px 25px 50px 25px;
			background-color: #26302E;
			width: 100%;
			height: auto;
			display: none;
			flex-direction: column;
			justify-content: space-between;
			gap: 110px;
			border-radius: 0 0 10px 10px;
			position: absolute;
			top: 0;
			right: 0;
			z-index: 2000;
			}
			.menu__button-close{
			background-color: transparent;
			color: #fff;
			border: none;
			width: 16px;
			height: 16px;
			align-self: flex-end;
			font-size: 20px;
			}
			.loged, .not-loged{
				display: none;
				flex-direction: column;
				gap:60px;
				text-align: center;
			}
			.text{
				margin:0;
				padding: 0;
				color: #FFFFFF;
				text-decoration: none;
				font-size: 24px;
				font-weight: 700;
				font-family: 'Poppins';
			}
			.option-footer{
				display: none;
				flex-direction: column;
				gap:20px;
				text-align: center;

			}	
			.option-contact{
				color:#EEEEEE;
				font-size: 16px;
				font-weight: 400;
				font-family: 'Poppins';
				text-decoration: none;
			}	
			.option-logout{
				color:#3B97D3;
				font-size: 16px;
				font-weight: 500;
				font-family: 'Roboto';
			}	
			`;

			this.shadow.appendChild(style);
			this.shadow.appendChild(div);
			const divLoged = this.shadow.querySelector(".loged");
			const divNotLoged = this.shadow.querySelector(".not-loged");
			const divFooter = this.shadow.querySelector(".option-footer");
			if (state.checkLogin()) {
				divLoged.style.display = "flex";
				divFooter.style.display = "flex";
			} else {
				divNotLoged.style.display = "flex";
			}

			const btnLogout = this.shadow.querySelector(".option-logout");
			const btnMenuOpen = this.shadow.querySelector(".menu__button-open");
			const menuWindow = this.shadow.querySelector(".menu-window");
			const btnMenuClose = this.shadow.querySelector(".menu__button-close");
			btnMenuClose.addEventListener("click", () => {
				menuWindow.style.display = "none";
			});
			btnMenuOpen.addEventListener("click", () => {
				menuWindow.style.display = "flex";
			});
			btnLogout.addEventListener("click", (e) => {
				e.preventDefault();
				state.logOut();
			});
			menuWindow.addEventListener("click", (e) => {
				if (e.target.tagName === "A") {
					menuWindow.style.display = "none"; // cerrás el menú
				}
			});
		}
	}
	customElements.define("header-comp", HeaderComp);
}
