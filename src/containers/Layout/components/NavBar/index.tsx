import { useTranslate } from "@/providers/LocaleProvider/hook";
import { NavOverlay } from "@@/NavOverlay";
import React, { type FC } from "react";

interface Props {}
export const NavBar: FC<Props> = ({}) => {
  const { getText } = useTranslate();
  return (
    <>
      <NavOverlay
        name={getText("main/header/takes/title")}
        page="modules"
        sections={[{ name: "Оптимізація Plinko", page: "modules/routing" }]}
      />
      <NavOverlay
        name={getText("main/header/modules/title")}
        page="modules"
        sections={[
          { name: "PathRouter", page: "modules/routing" },
          { name: "StateDispatcher", page: "modules/dispather" },
        ]}
      />
    </>
  );
};
