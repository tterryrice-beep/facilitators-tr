import { setModal, setPage } from "@/modules";
import { Modal } from "@/Modals/Empty";
import { lazy } from "react";

const Default = lazy(() => import("@/Pages/_Empty"));
const Home = lazy(() => import("@/Pages/Home"));

export const route = {
  pages: {
    "/": setPage({ component: Home }),
    test: setPage({ component: Default }),
    "*": setPage({ component: Home }),
  },
  modals: {
    test: setModal({
      component: Modal,
    }),
  },
} as const;
