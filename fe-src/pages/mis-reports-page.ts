export function misReportsPage() {
	class MisReportsPage extends HTMLElement {
		constructor() {
			super();
			this.render();
		}
		render() {
			const shadow = this.attachShadow({ mode: "open" });
			const div = document.createElement("div");
			const style = document.createElement("style");
			div.classList.add("container");
			const imagenEmptyReport = require("url:../icons/icon-misReports.png");
			//esta info debe venir del state, por ahora sirve para maquetar
			const petsInfo = [
				// { name: "beto", location: "cipolletti,rn" },
				// { name: "coki", location: "neuquen, nqn" },
				// { name: "uri", location: "plottier, nqn" },
				// { name: "micho", location: "allen, rn" },
			];
			div.innerHTML = `
        <div class="text">
          <text-comp class="text-title" variant="subtitleBold">Mascotas</text-comp>
          <text-comp class="text-title" variant="subtitleBold">reportadas</text-comp>							
        </div>
				<div class="container-cards">
					${petsInfo
						.map((pet) => {
							return `<card-comp class="card"petName="${pet.name}" petLocation="${pet.location}" petImgUrl ="" variant="edit"></card-comp>`;
						})
						.join("")}
				</div>
        <div class="empty-report">
            <text-comp class="text-body" variant="text">Aún no reportaste mascotas perdidas</text-comp>
            <img class="img" src="${imagenEmptyReport}">
        </div>
        <button-comp class="button" variant="blue">Publicar reporte</button-comp>    
            `;
			style.innerHTML = `
        .container{
        height: 100%;
        max-width: 100%;
        padding-top:40px;
        padding-bottom:35px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap:20px;
        }
        .text{
          text-align: center;
          margin-bottom: 20px;
        }
        .container-cards{
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px; /* Espacio entre las cards */
        }
        .empty-report{
          flex-direction: column;
          gap:15px;
          text-align: center;

        } 
        .img{
          width:305px;
          height:250px;
          margin-top:20px;
          margin-bottom:25px;
        }
        .button{
        margin-top:20px;
        }
      `;
			shadow.appendChild(div);
			shadow.appendChild(style);
			const emptyReport = shadow.querySelector(".empty-report");
			if (petsInfo.length > 0) {
				emptyReport.style.display = "none";
				return petsInfo;
			} else {
				emptyReport.style.display = "flex";
			}
			//si no lo hago asi, me toma el clik solo del primer card
			const editButtons = shadow.querySelectorAll(".card");
			editButtons.forEach((edit) => {
				edit.addEventListener("click", () => {
					console.log("soy edit card");
				});
			});
			const reportButton = shadow.querySelector(".button");
			reportButton.addEventListener("click", () => {
				console.log("soy report button");
			});
		}
	}
	customElements.define("mis-reports-page", MisReportsPage);
}
