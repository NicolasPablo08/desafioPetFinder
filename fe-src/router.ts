import { Router } from "@vaadin/router";

const router = new Router(document.getElementById("outlet"));
router.setRoutes([
	{ path: "/", component: "home-page" },
	{ path: "/users", component: "x-user-list" },
]);
