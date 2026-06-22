import { setModal, setPage } from "@/modules";
import { Modal } from "@/Modals/Empty";
import { lazy } from "react";

const Default = lazy(() => import("@/Pages/_Empty"));
const Home = lazy(() => import("@/Pages/Home"));
const Routing = lazy(() => import("@/Pages/Routing"));

export const route = {
  pages: {
    "/": setPage({ component: Home }),
    "/modules": {
      ...setPage({ component: Default }),

      routing: setPage({ component: Routing }),

      "*": setPage({ component: Routing }),
    },
    test: setPage({ component: Default }),
    "*": setPage({ component: Home }),
  },
  modals: {
    test: setModal({
      component: Modal,
    }),
  },
} as const;
