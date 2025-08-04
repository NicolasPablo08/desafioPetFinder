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
      div.innerHTML = `
			<div class= "header__logo-container">
				<img class="logo" src="../icons/icon-header.png" alt="Logo">
			</div>
			<div class ="header__menu-container">
			<button class="menu__button-open">
			<img class="button__open-icon">
			</button>
			<div class="menu-window">
				<button class="menu__button-close">
					<img class="button__close-icon">
				</button>
				<div class="menu-options">
					<div class="option">
						<a	href="" class="option-dates text"> Mis datos</a> 
						<a	href="" class="option-my-reports text"> Mis mascotas reportadas</a>
						<a	href="" class="option-report text"> Reportar mascota</a>
					</div>
					<div class="option-footer">
						<a href="" class="option-contact">email@gmail.com</a>
						<a href="" class="option-logout">CERRAR SESIÓN</a>	
					</div>
				</div>	
			</div>	
			`;
      style.innerHTML = `
			.header-container {
			width: 100%;
			height: 60px;
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			background-color: #26302E;
				}
			`;

      shadow.appendChild(style);
      shadow.appendChild(div);
    }
  }
  customElements.define("header-comp", HeaderComp);
}
