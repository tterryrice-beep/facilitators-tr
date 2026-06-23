import { setModal, setPage } from "@/modules";
import { Modal } from "@/Modals/Empty";
import { lazy } from "react";

const Default = lazy(() => import("@/Pages/_Empty"));
const Home = lazy(() => import("@/Pages/Home"));
const Routing = lazy(() => import("@/Pages/Routing"));

export const route = {
  pages: {
    "/": setPage({ component: Home, title: "Home" }),
    modules: {
      ...setPage({ component: Default, title: "Modules" }),

      routing: setPage({ component: Routing, title: "Routing" }),

      "*": setPage({ component: Routing, title: "Modules Wrong" }),
    },
    test: setPage({ component: Default, title: "Test Page" }),
    "*": setPage({ component: Home, title: "Wrong Pages Just show Home" }),
  },
  modals: {
    test: setModal({
      component: Modal,
    }),
  },
} as const;
