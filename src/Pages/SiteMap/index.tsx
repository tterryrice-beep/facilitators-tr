import React, { type FC, useState } from "react";
import { parseRouteConfig } from "path-router-red/dist/PathRouter/utils";

import { route } from "@/config";
import { NavLink } from "@/providers/Router";
import { useTranslate } from "@/providers/LocaleProvider/hook";

import { ObjectView } from "@@/ObjectView";
import { Text } from "@@/Text";

const { modals, pages } = parseRouteConfig(route);

const Page: FC = ({}) => {
  const [modal, setModal] = useState(false);
  const { getText, changeLanguage } = useTranslate();

  return (
    <section>
      <Text tag="h1" type="title">
        Мапа Сайту
      </Text>

      <div
        className={
          "flex justify-between mt-10 gap-24 w-full flex-col items-stretch sm:flex-row "
        }>
        <div className="w-full">
          <Text className="mb-6 block">Список усіх сторінок:</Text>

          <ul className="w-full">
            {pages.map(({ data, pathName }) => {
              return (
                <li className="w-full list-disc py-1 ml-2">
                  <NavLink
                    className="w-full flex justify-between gap-4"
                    to={pathName}>
                    <p className="whitespace-nowrap">
                      {"title" in data ? data.title : pathName}
                    </p>
                    <div className=" h-1 w-full border-b border-dashed border-gray-600" />
                    <pre>{pathName}</pre>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="w-full">
          <Text className="mb-6 block">Список усіх модалок:</Text>

          <ul className="w-full">
            {modals.map(({ data, pathName }) => {
              return (
                <li className="w-full list-disc">
                  <NavLink
                    className="w-full flex justify-between gap-4"
                    modal={pathName}>
                    <p className="whitespace-nowrap">{data.title}</p>
                    <div className=" h-1 w-full border-b border-dashed border-gray-600" />
                    <pre>{pathName}</pre>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <hr className="my-12 border-gray-600" />
      <Text className="mb-6 block ">Router Config</Text>
      <ObjectView
        data={{
          routes: route,
          parsedPages: pages,
          parsedModals: modals,
        }}
      />
    </section>
  );
};

export default Page;
