import { setModal, setPage } from "@/modules";
import { Modal } from "@/Modals/Empty";
import { Page } from "@/Pages/Empty";

export const route = {
  pages: {
    home: setPage({ component: Page }),
    about: setPage({ component: Page }),
    "*": setPage({ component: Page }),
  },
  modals: {
    test: setModal({
      component: Modal,
    }),
  },
} as const;
