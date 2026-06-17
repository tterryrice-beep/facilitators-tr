import React, { type FC } from "react";

interface Props {}

import css from "./style.module.scss";
import { PathRouterContainer } from "@/modules";
import { route } from "@/config";
import { Header } from "./components";

export const Layout: FC<Props> = ({}) => {
  return (
    <div>
      <Header />
      <PathRouterContainer
        config={route}
        fallback={<>Усе ок, ми завантажуємося</>}
      />
    </div>
  );
};
