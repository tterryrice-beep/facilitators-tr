import React, { type FC, useState } from "react";

import { useTranslate } from "@/providers/LocaleProvider/hook";
import css from "./style.module.scss";

const Page: FC = ({}) => {
  const { getText, changeLanguage } = useTranslate();

  return (
    <section className={css.page}>
      
    </section>
  );
};

export default Page;
