export function inputComp() {
	class InputComp extends HTMLElement {
		constructor() {
			super();
			this.render();
		}
		render() {
			const shadow = this.attachShadow({ mode: "open" });
			const container = document.createElement("div");
			const nameAttribute = this.getAttribute("name");
			const variant = this.getAttribute("variant");
			const label = document.createElement("label");
			label.style.fontSize = "16px";
			label.style.fontWeight = "400";
			label.textContent = this.textContent;
			label.setAttribute("variant", "text");
			const input = document.createElement("input");
			input.setAttribute("name", nameAttribute);
			const style = document.createElement("style");
			if (variant === "black") {
				input.style.backgroundColor = "#4A5553";
				input.style.color = "#fff";
				label.style.color = "#fff";
				input.style.border = "none";
			}
			const height = this.getAttribute("height");
			if (height) input.style.height = height;
			style.textContent = `
      input {
			box-sizing: border-box;
      margin:0;
      padding:0;
      width: 100%;
      height:50px;
      border-radius: 4px;
      }
        `;
			shadow.appendChild(style);
			container.appendChild(label);
			container.appendChild(input);
			shadow.appendChild(container);
		}
	}
	customElements.define("input-comp", InputComp);
}
