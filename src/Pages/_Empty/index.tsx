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
    </section>
  );
};

export default Page;
