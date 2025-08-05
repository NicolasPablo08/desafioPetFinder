export function buttonComp() {
	class ButtonComp extends HTMLElement {
		constructor() {
			super();
			this.render();
		}
		render() {
			const shadow = this.attachShadow({ mode: "open" });
			const buttonEl = document.createElement("button");
			const variant = this.getAttribute("variant");
			buttonEl.classList.add(variant);
			buttonEl.classList.add("button");
			buttonEl.textContent = this.textContent;
			const style = document.createElement("style");
			style.innerHTML = `
      .button{
      margin: 0;
      padding: 0 20px;
      width: 100%;
      height:50px;
      border-radius:4px;
      border:none;
      color: #FFFFFF;
      font-size:16px;
      font-weight: 700;
      }
      .green{
      background-color:#00A884;
      }
      .red{
      background-color:#EB6372;
      }
      .blue{
      background-color:#5A8FEC;
      }
      .gray{
      background-color:#4A5553;
      }
      `;
			shadow.appendChild(style);
			shadow.appendChild(buttonEl);
			//enviamos a quien corresponda cuando se haga un click
			// shadow.querySelector(".button").addEventListener("click", () => {
			// 	this.dispatchEvent(new CustomEvent("click"));
			// });
		}
	}
	customElements.define("button-comp", ButtonComp);
}
