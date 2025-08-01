export function textComp() {
	class TextComp extends HTMLElement {
		constructor() {
			super();
			this.render();
		}
		render() {
			const shadow = this.attachShadow({ mode: "open" });
			const variant = this.getAttribute("variant");
			const choice =
				variant === "title"
					? "h1"
					: variant === "subtitle"
					? "h3"
					: variant === "subtitleBold"
					? "h3"
					: variant === "text"
					? "p"
					: variant === "textBold"
					? "p"
					: variant === "link"
					? "a"
					: "p";
			const textEl = document.createElement(choice);
			textEl.classList.add(variant);
			textEl.classList.add("principal");
			textEl.textContent = this.textContent;
			const style = document.createElement("style");
			style.innerHTML = `
      .principal{
      font-family: "poppins";
      color: #000000;
      }
      .title{
      font-size: 36px;
      font-weight: 700;
      
      }
      .subtitle{
      font-size: 24px;
      font-weight: 400;
     
      }
      .subtitleBold{
      font-size: 24px;
      font-weight: 700;
      
      }
      .text{
      font-size: 16px;
      font-weight: 400;
      
      }
      .textBold{
      font-size: 16px;
      font-weight: 700;
      font-family: "roboto";
      }
      .link{
       font-size: 16px;
      font-weight: 500;
      font-family: "roboto";
      color:#3B97D3;
      }
      `;
			shadow.appendChild(style);
			shadow.appendChild(textEl);
		}
	}
	customElements.define("text-comp", TextComp);
}
