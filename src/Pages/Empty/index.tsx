import React, { type FC, useState } from "react";

import { Overlay, OverlayPosition } from "@@/overlays";
import { Button } from "@@/Button";

import { useTranslate } from "@/providers/LocaleProvider/hook";
import css from "./style.module.scss";

const Page: FC = ({}) => {
  const [modal, setModal] = useState(false);
  const { getText, changeLanguage } = useTranslate();

  return (
    <section className={css.page}>
      <div>Page Content</div>
      <div>{getText("test")}</div>
      <button onClick={() => setModal(true)}>OPEN MODAL</button>
      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => changeLanguage("en")}>
          EN
        </button>
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => changeLanguage("uk")}>
          UK
        </Button>
      </div>

      <Overlay
        isOpen={modal}
        anchor={OverlayPosition.CENTER}
        onClose={() => setModal(false)}>
        <div className="bg-green-500">Overlay Content</div>
      </Overlay>
    </section>
  );
};

export default Page;
