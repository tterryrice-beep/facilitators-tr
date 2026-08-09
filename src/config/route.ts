import { lazy } from "react";
import { setModal, setPage } from "path-router-red";

const Default = lazy(() => import("@/Pages/_Empty"));
const Home = lazy(() => import("@/Pages/Home"));
const Routing = lazy(() => import("@/Pages/Routing"));
const StateDispatcher = lazy(() => import("@/Pages/StateDispatcher"));
const SiteMap = lazy(() => import("@/Pages/SiteMap"));
const Cards = lazy(() => import("@/Pages/Cards"));

const Modal = lazy(() => import("@/Modals/Empty"));

export const route = {
  pages: {
    "/": setPage({ component: Home, title: "Home" }),
    map: {
      ...setPage({ component: SiteMap, title: "Site Map" }),
    },
    utils: {
      cards: setPage({ component: Cards, title: "Cards App page" }),
    },
    modules: {
      ...setPage({ component: Default, title: "Modules" }),

      routing: setPage({ component: Routing, title: "Routing" }),
      dispather: setPage({
        component: StateDispatcher,
        title: "StateDispatcher",
      }),

      "*": setPage({ component: Routing, title: "Modules 404" }),
    },
    test: setPage({ component: Default, title: "Test Page" }),
    "*": setPage({ component: Home, title: "404" }),
  },
  modals: {
    test: setModal({ component: Modal, title: "Test Modal" }),
  },
} as const;
