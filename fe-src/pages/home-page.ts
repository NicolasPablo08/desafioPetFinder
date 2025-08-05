// import imgUrl from "../icons/icon-home.png?url";

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

      div.classList.add("home__container");
      div.innerHTML = `
				<div class="home-img">
					<img class="img" src="${imgUrl}">
				</div>
				<div class=home-text>
					<text-comp class="text-title" variant="title">Pet Finder APP</text-comp>		
					<text-comp class="text-body" variant="subtitle">Encontrá y reportá mascotas perdidas cerca de tu ubicación</text-comp>
				</div>
				<div class="home-buttons">
					<button-comp class="button-ubication" variant="blue">Dar mi ubicación actual</button-comp>
					<button-comp class="button-intructions" variant="green">¿Cómo funciona Pet Finder?</button-comp>
				</div>
			`;
      shadow.appendChild(div);
      shadow.appendChild(style);
    }
  }
  customElements.define("home-page", HomePage);
}
