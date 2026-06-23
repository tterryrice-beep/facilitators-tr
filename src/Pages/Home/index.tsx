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
      <br />
      <div className="flex justify-between items-center">
        <div>
          <p>Сторінки</p>
          <hr />
          <br />
          <br />
          <ul className="w-full">
            {pages.map(({ data, pathName }) => {
              return (
                <li className="w-full list-disc">
                  <NavLink
                    className="w-full flex justify-between gap-12"
                    //@ts-ignore
                    to={pathName}>
                    <p >{data.title}</p>
                    <pre>{pathName}</pre>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p>Модалки</p>
          <hr />
          <br />
          <br />
          <ul>
            {modals.map(({ data, pathName }) => {
              return (
                <li className="w-full list-disc">
                  <NavLink
                    //@ts-ignore
                    modal={pathName}>
                    <pre>{pathName}</pre>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Page;
