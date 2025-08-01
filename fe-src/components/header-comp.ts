export function headerComp() {
	class HeaderComp extends HTMLElement {
		constructor() {
			super();
			this.render();
		}
		render() {
			const shadow = this.attachShadow({ mode: "open" });
			const div = document.createElement("div");
			const style = document.createElement("style");

			shadow.appendChild(style);
			shadow.appendChild(div);
		}
	}
	customElements.define("header-comp", HeaderComp);
}
