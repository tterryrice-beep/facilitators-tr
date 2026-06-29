import { setModal, setPage } from "@/modules";
import { Modal } from "@/Modals/Empty";
import { lazy } from "react";

const Default = lazy(() => import("@/Pages/_Empty"));
const Home = lazy(() => import("@/Pages/Home"));
const Routing = lazy(() => import("@/Pages/Routing"));
const StateDispatcher = lazy(() => import("@/Pages/StateDispatcher"));
const SiteMap = lazy(() => import("@/Pages/SiteMap"));

export const route = {
  pages: {
    "/": setPage({ component: Home, title: "Home" }),
    map: {
      ...setPage({ component: SiteMap, title: "Site Map" }),
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
