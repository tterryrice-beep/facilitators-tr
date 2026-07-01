import React, { type FC, useState } from "react";
import clsx from "clsx";

import { useTranslate } from "@/providers/LocaleProvider";
import { JSXView } from "@@/JSXView";
import { JSView } from "@@/JSView";

import { BannerItem } from "./components";
import css from "./style.module.scss";

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
      <div className="flex flex-col gap-6 max-w-[650px]">
        {/* -- Router -- */}
        <BannerItem
          to="modules/routing"
          title="PathRouter"
          banner={
            <>
              <div className="mim-w-[auto] w-full sm:w-auto min-w-[260px]">
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
              <div className="mim-w-[auto] w-full sm:w-auto sm:min-w-[300px]">
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
