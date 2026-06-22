import React, { type FC, useState } from "react";
import { Overlay, OverlayPosition } from "@@/overlays";

import css from "./style.module.scss";
import { useTranslate } from "@/providers/LocaleProvider/hook";

export const Page: FC = ({}) => {
  const [modal, setModal] = useState(false);
  const { getText } = useTranslate();

  const text = getText("test")
  return (
    <section className={css.page}>
      <div>Page Content</div>
      <div>{}</div>
      <button onClick={() => setModal(true)}>OPEN MODAL</button>

      <Overlay
        isOpen={modal}
        anchor={OverlayPosition.CENTER}
        onClose={() => setModal(false)}>
        <div className="bg-green-500">Overlay Content</div>
      </Overlay>
    </section>
  );
};
