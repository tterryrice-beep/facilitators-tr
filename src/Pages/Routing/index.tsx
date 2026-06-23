import React, { type FC, useState } from "react";

import { useTranslate } from "@/providers/LocaleProvider/hook";
import css from "./style.module.scss";
import { createRoute } from "@/modules/PathRouter/utils";
import { route } from "@/config";
import { Heading } from "@@/Heading";
import { Text } from "@@/Text";

const { modals, pages } = createRoute(route);

const Page: FC = ({}) => {
  const { getText, changeLanguage } = useTranslate();
  return (
    <div className={css.page}>
      <Heading title={"Routing"} rightBar={<div>github ling be here</div>} />

      <section id="overview">
        <Text type="subtitle">Overview</Text>
        <br />
        <Text>Ідея даного роутингу полягає </Text>
      </section>
    </div>
  );
};

export default Page;
