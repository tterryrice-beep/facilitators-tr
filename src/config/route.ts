import { setModal, setPage } from "@/modules";
import { Modal } from "@/Modals/Empty";
import { lazy } from "react";

const Default = lazy(() => import("@/Pages/Empty"));

export const route = {
  pages: {
    home: setPage({ component: Default }),
    about: setPage({ component: Default }),
    "*": setPage({ component: Default }),
  },
  modals: {
    test: setModal({
      component: Modal,
    }),
  },
} as const;
