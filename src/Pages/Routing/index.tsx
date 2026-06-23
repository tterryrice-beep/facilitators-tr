import React, { type FC, useState } from "react";

import { useTranslate } from "@/providers/LocaleProvider/hook";
import css from "./style.module.scss";
import { createRoute } from "@/modules/PathRouter/utils";
import { route } from "@/config";
import { Heading } from "@@/Heading";
import { Text } from "@@/Text";
import { ObjectView } from "@@/ObjectView";

const { modals, pages } = createRoute(route);

const Page: FC = ({}) => {
  const { getText, changeLanguage } = useTranslate();
  return (
    <div className={css.page}>
      <Heading title={"Routing"} rightBar={<div>github ling be here</div>} />

      <section id="overview">
        <Text type="subtitle">Overview</Text>
        <br />
        <br />
        <Text>
          На багатьох проектах де я працював часто були проблеми зі Зручністю
          маршрутизації.
          <br />В кращому разі, вона виглядала ось так:
        </Text>

        <div className="mb-6 mt-6 ">
          <ObjectView
            defaultExpanded
            data={{
              route: [
                {
                  path: "/about",
                  component: "AboutRoot",
                },
                {
                  path: "/about/terms",
                  component: "Terms",
                },
                {
                  path: "/about/privacy",
                  component: "Privacy",
                },
              ],
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default Page;
