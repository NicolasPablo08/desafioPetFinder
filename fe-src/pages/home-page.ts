export function homePage() {
	class HomePage extends HTMLElement {
		shadow = this.attachShadow({ mode: "open" });
		constructor() {
			super();
			this.render();
		}
		render() {
			const div = document.createElement("div");
			const style = document.createElement("style");
		}
	}
}
