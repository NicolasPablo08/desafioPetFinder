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

      const emojis = ["&#128049;", "&#128054;", "&#128057;"];
      let index = 0;

      const interval = setInterval(() => {
        div.innerHTML = `<h3 class="emoji">${emojis.slice(0, index + 1).join(" ")}</h3>`;
        index++;
        if (index === emojis.length) {
          index = 0;
        }
      }, 1000);
      const style = document.createElement("style");
      style.innerHTML = `
      .div__container{
        margin:0;
        padding:0;
        width: 100%;
        height:100%;
        background-color: transparent;
        display:flex;
        flex-direction:column;
        justify-content: center;
        align-items: center;
        z-index: 2000;
      }
      .emoji{
        margin:0;
        padding:0;
        font-size: 40px;
        
      }
      `;
      shadow.appendChild(style);
      shadow.appendChild(div);
    }
  }
  customElements.define("load-comp", LoadComp);
}
