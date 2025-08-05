import { router } from "./router";
import { buttonComp } from "./components/button-comp";
import { textComp } from "./components/text-comp";
import { inputComp } from "./components/input-comp";
import { cardComp } from "./components/card-comp";
import { headerComp } from "./components/header-comp";
import { homePage } from "./pages/home-page";
import { petLostPage } from "./pages/pet-lost-page";
(function main() {
	router;
	buttonComp();
	textComp();
	inputComp();
	cardComp();
	headerComp();
	homePage();
	petLostPage();
})();
