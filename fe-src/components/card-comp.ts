export function cardComp() {
	class CardComp extends HTMLElement {
		constructor() {
			super();
			this.render();
		}
		render() {
			const shadow = this.attachShadow({ mode: "open" });
			const div = document.createElement("div");
			const style = document.createElement("style");
			const variant = this.getAttribute("variant");
			div.classList.add("card");
			let petImg; //remplazar
			let petName = "Bobby"; //remplazar
			let petLocation = "Buenos Aires, Argentina"; //remplazar
			let btnType;
			let btnText;
			if (variant === "edit") {
				btnType = "blue";
				btnText = "Editar 🖉";
			} else if (variant === "report") {
				btnType = "red";
				btnText = "Reportar 🚨";
			}
			div.innerHTML = `
      <div class="img-container">
        <img class="card-img" src=${petImg} alt="Card Image">
      </div>
      <div class="card-container">
        <div class="card-data">
          <text-comp class="card-text" variant= "title">${petName}</text-comp> 
          <text-comp class="card-text" variant="textBold">${petLocation}</text-comp>
        </div>
        <button-comp class="card-btn" variant=${btnType}>${btnText}</button-comp> 
      </div>
      `;
			style.innerHTML = `
      .card{
      width:335px;
      height:234px;
      padding:7px;
      margin:0;
      background-color:#26302E;
      border-radius:10px;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      }
      .img-container{
      width:100%;
      height: 136px;
      }
      .card-img{
      width:100%;
      height:100%;
      }
      .card-container{
      margin:0; 
      height:98px;
      width:100%;
      display:flex;
      flex-direction:row;
      justify-content:space-between;
      }
      .card-data{
      display:flex;
      flex-direction:column;
      gap:10px;
      justify-content:center;
      }
      .card-text{
      color: #FFFFFF;
      }
      .card-btn{
      align-self:center;
      }
      
      `;
			shadow.appendChild(div);
			shadow.appendChild(style);
		}
	}
	customElements.define("card-comp", CardComp);
}
