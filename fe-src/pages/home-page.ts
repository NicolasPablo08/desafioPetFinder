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
			const imageSrc = require("url:../icons/icon-home.png");
			div.classList.add("home__container");
			div.innerHTML = `
				<div class="home-img">
					<img class="img" src="${imageSrc}">
				</div>
				<div class="home-text">
					<text-comp class="text-title" variant="title">Pet Finder APP</text-comp>		
					<text-comp class="text-body" variant="subtitle">Encontrá y reportá mascotas perdidas cerca de tu ubicación</text-comp>
				</div>
				<div class="home-buttons">
					<button-comp class="button-ubication" variant="blue">Dar mi ubicación actual</button-comp>
					<button-comp class="button-intructions" variant="green">¿Cómo funciona Pet Finder?</button-comp>
				</div>
			`;
			style.innerHTML = `
      .home__container{
        height: 100%;
        max-width: 100%;
        margin:0;
        padding:40px 53px 0 53px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap:20px;
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
        gap:15px;
      }
      .text-title{
      color:#EB6372;
      }
      .home-buttons{
      display: flex;
      flex-direction: column;
      gap:20px;
      } 
      `;
			shadow.appendChild(div);
			shadow.appendChild(style);
		}
	}
	customElements.define("home-page", HomePage);
}
