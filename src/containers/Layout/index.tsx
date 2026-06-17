import React, { type FC } from "react";

interface Props {}

import css from "./style.module.scss";
import { PathRouterContainer } from "~/modules";
import { route } from "~/config";

export const Layout: FC<Props> = ({}) => {
  return (
    <div>
      <PathRouterContainer
        config={route}
        fallback={<>Усе ок, ми завантажуємося</>}
      />
    </div>
  );
};
