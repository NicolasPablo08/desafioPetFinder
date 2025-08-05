import { Router } from "@vaadin/router";

export const router = new Router(document.documentElement.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/users", component: "x-user-list" },
]);
