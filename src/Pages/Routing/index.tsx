import React, { type FC, useState } from "react";

import { useTranslate } from "@/providers/LocaleProvider/hook";
import css from "./style.module.scss";
import { createRoute } from "@/modules/PathRouter/utils";
import { route } from "@/config";
import { NavLink } from "@/providers/Router";

const { modals, pages } = createRoute(route);
const Page: FC = ({}) => {
  const { getText, changeLanguage } = useTranslate();
  return (
    <section className={css.page}>
      <h1>Routing</h1>
    </section>
  );
};

export default Page;
