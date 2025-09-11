import { Router } from "@vaadin/router";

export const router = new Router(document.documentElement.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/share-loc", component: "share-loc-page" },
  { path: "/lost-pets", component: "pet-lost-page" },
  { path: "/login", component: "login-page" },
  { path: "/regist", component: "regist-page" },
  { path: "/perfil", component: "perfil-page" },
  { path: "/data", component: "my-data-page" },
  { path: "/pass", component: "my-pass-page" },
  { path: "/restore-pass", component: "enter-email-page" },
  { path: "/send-code", component: "enter-code-page" },
  { path: "/report", component: "report-page" },
  { path: "/edit-report/:petId", component: "edit-report-page" },
  { path: "/my-reports", component: "my-reports-page" },
]);
