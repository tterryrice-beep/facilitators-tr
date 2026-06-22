import React, { type FC, useState } from "react";
import { Overlay, OverlayPosition } from "@@/overlays";

import { useTranslate } from "@/providers/LocaleProvider/hook";
import css from "./style.module.scss";

export const Page: FC = ({}) => {
  const [modal, setModal] = useState(false);
  const { getText, language, loading } = useTranslate();

  console.log({
    language,
    loading,
  });

  return (
    <section className={css.page}>
      <div>Page Content</div>
      <div>{getText("test")}</div>
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
