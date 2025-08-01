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
			const label = document.createElement("label");
			label.style.fontSize = "16px";
			label.style.fontWeight = "400";
			label.textContent = this.textContent;
			label.setAttribute("variant", "text");
			const input = document.createElement("input");
			input.setAttribute("name", nameAttribute);
			const style = document.createElement("style");
			style.textContent = `
      input {
      margin:0;
      padding:0;
      width: 100%;
      height:50px;
      border: 1px solid #ccc;
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
