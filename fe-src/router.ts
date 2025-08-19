import { Router } from "@vaadin/router";

export const router = new Router(
	document.documentElement.querySelector(".root")
);
router.setRoutes([
	{ path: "/", component: "home-page" },
	{ path: "/lost-pets", component: "pet-lost-page" },
	{ path: "/inicio", component: "init-page" },
	{ path: "/login", component: "login-page" },
	{ path: "/regist", component: "regist-page" },
	{ path: "/perfil", component: "perfil-page" },
	{ path: "/datos", component: "mis-datos-page" },
	{ path: "/pass", component: "mi-pass-page" },
	{ path: "/report", component: "report-page" },
	{ path: "/edit-report/:petId", component: "edit-report-page" },
	{ path: "/mis-reports", component: "mis-reports-page" },
]);
