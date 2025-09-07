export function loadComp() {
	class LoadComp extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: "open" });
			this.render();
		}

		render() {
			const shadow = this.shadowRoot; // Usamos el shadowRoot ya creado
			shadow.innerHTML = "";
			const div = document.createElement("div");
			div.classList.add("div__container");
			div.innerHTML = `
      <h3 class="message"></h3>
      `;
			const style = document.createElement("style");
			style.innerHTML = `
      .div__container{
        width: 275px;
        height:175px;
        padding:10px 20px;
        background-color: #f0f0f0;
        border-radius: 10px;
        border:solid 2px black;
        display:flex;
        flex-direction:column;
        justify-content: center;
      }
      .message{
        margin:0;
        text-align: center;
        font-family: "poppins";
        font-size: 24px;
        font-weight: 600;
        color:#333333;
      }
      `;
			shadow.appendChild(style);
			shadow.appendChild(div);
		}
	}
	customElements.define("load-comp", LoadComp);
}
