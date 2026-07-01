import React, { type FC, useState } from "react";

import { route } from "@/config";
import { useTranslate } from "@/providers/LocaleProvider/hook";
import { NavLink } from "@/providers/Router";
import { parseRouteConfig } from "@/modules/PathRouter/utils";

import css from "./style.module.scss";
import clsx from "clsx";
import { Text } from "@@/Text";
import { ObjectView } from "@@/ObjectView";
import { JSXView } from "@@/JSXView";
import { BannerItem } from "./components";
import { JSView } from "@@/JSView";

const { modals, pages } = parseRouteConfig(route);

const Page: FC = ({}) => {
  const { getText } = useTranslate();

  return (
    <section className={clsx(css.page, "")}>
      {/* -- Main Banner -- */}

      <div className="pt-10 max-w-[370px]">
        <span
          dangerouslySetInnerHTML={{
            __html: getText("Home/title"),
          }}
        />
        <span className="mt-6 mb-2 block">{getText("Home/description")}</span>
        <span className="text-sm text-gray-400">{getText("Home/abt")}</span>
      </div>

      {/* -- Content -- */}
      <div className="flex flex-col gap-3 max-w-[650px]">
        {/* -- Router -- */}
        <BannerItem
          to="modules/routing"
          title="PathRouter"
          banner={
            <>
              <div className="w-[260px]">
                <JSXView>{`{
    "/": <Home />,
    "goods": <Goods />,
    "services": <Services />,
}`}</JSXView>
              </div>
            </>
          }
          discribe={
            <>
              {getText("Home/PathRouter/desc")}
              <br />
              <br />
              {getText("Home/PathRouter/desc_2")}
            </>
          }
        />

        {/* -- StateDispatcher -- */}
        <BannerItem
          to="modules/dispather"
          title="StateDispatcher"
          banner={
            <>
              <div className="w-[300px]">
                <JSView>{`class User extends StateDispatcher
...
  user.listen("name", setName);
  user.setters.name("John");
`}</JSView>
              </div>
            </>
          }
          discribe={
            <>
              {getText("Home/StateDispatcher/desc")}
              <br />
              <br />
              {getText("Home/StateDispatcher/desc_2")}
            </>
          }
        />
      </div>
    </section>
  );
};

export default Page;
