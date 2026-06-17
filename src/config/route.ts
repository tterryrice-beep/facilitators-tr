import { Modal } from "@/Modals/Empty";
import { setModal, setPage } from "@/modules";
import { Page } from "@/Pages/Empty";

export const route = {
  pages: {
    "*": setPage({ component: Page }),
  },
  modals: {
    test: setModal({
      component: Modal,
    }),
  },
} as const;
