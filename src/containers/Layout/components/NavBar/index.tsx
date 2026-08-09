import { useTranslate } from "@/providers/LocaleProvider/hook";
import { usePath, type PagePath } from "@/providers/Router";
import { NavOverlay } from "@@/NavOverlay";
import React, { type FC } from "react";

interface Props {}
export const NavBar: FC<Props> = ({}) => {
  const { getText } = useTranslate();
  const { path } = usePath().page;
  return (
    <>
      {/* <NavOverlay
        name={getText("main/header/takes/title")}
        page="modules"
        sections={[{ name: "Оптимізація Plinko", page: "modules/routing" }]}
      /> */}
      <NavOverlay
        name={getText("main/header/modules/title")}
        page={path as PagePath}
        sections={[
          { name: "PathRouter", page: "modules/routing" },
          { name: "StateDispatcher", page: "modules/dispather" },
        ]}
      />
    </>
  );
};
