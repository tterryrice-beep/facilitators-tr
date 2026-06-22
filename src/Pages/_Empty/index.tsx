import React, { type FC, useState } from "react";

import { Overlay, OverlayPosition } from "@@/overlays";

import { useTranslate } from "@/providers/LocaleProvider/hook";
import css from "./style.module.scss";
import { PrimaryButton } from "@@/PrimaryButton";

const Page: FC = ({}) => {
  const [modal, setModal] = useState(false);
  const { getText, changeLanguage } = useTranslate();

  return (
    <section className={css.page}>
      <div>Page Content</div>
      <div>{getText("test")}</div>
      <button onClick={() => setModal(true)}>OPEN MODAL</button>
      <div className="flex gap-2">
        <PrimaryButton onClick={() => changeLanguage("en")}>EN</PrimaryButton>
        <PrimaryButton onClick={() => changeLanguage("uk")}>UK</PrimaryButton>
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
