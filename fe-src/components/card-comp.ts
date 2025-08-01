export function cardComp() {
  class CardComp extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      const variant = this.getAttribute("variant");
      div.classList.add("card");
      div.innerHTML = `
      <div class="img-container">
        <img class="card-img" src="${this.getAttribute("img") || ""} " alt="Card Image">
      </div>
      <div class="card-container">
        <div class="card-data">
          <h3 class="card-name">${this.getAttribute("name") || "Card Name"}</h3> 
          <h5 class="card-location">${this.getAttribute("location") || "Location"}</h5>
        </div>
        <button-comp class="card-btn" variant="${variant}"></button-comp> 
      </div>
      `;
      shadow.appendChild(div);
    }
  }
  customElements.define("card-comp", CardComp);
}
