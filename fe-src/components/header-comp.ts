export function headerComp() {
  class HeaderComp extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      div.classList.add("header-container");
      const style = document.createElement("style");
      const imageSrc = "/icon-header.bd0bc3f3.png"; //no se porque tuve que poner esa ruta y extemsion
      const userMail = "emailDelUser@gmail.com"; //remplazar con el email del usuario logueado
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
					<a	href="" class="option-dates text"> Mis datos</a> 
					<a	href="" class="option-my-reports text"> Mis mascotas <br> reportadas</a>
					<a	href="" class="option-report text"> Reportar mascota</a>
				</div>
				<div class="option-footer">
					<a href="" class="option-contact">${userMail}</a>
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
			.menu-options{
				display: flex;
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
				display: flex;
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

      shadow.appendChild(style);
      shadow.appendChild(div);

      const btnMenuOpen = shadow.querySelector(".menu__button-open");
      const menuWindow = shadow.querySelector(".menu-window");
      const btnMenuClose = shadow.querySelector(".menu__button-close");
      btnMenuClose.addEventListener("click", () => {
        menuWindow.style.display = "none";
      });
      btnMenuOpen.addEventListener("click", () => {
        menuWindow.style.display = "flex";
      });
    }
  }
  customElements.define("header-comp", HeaderComp);
}
