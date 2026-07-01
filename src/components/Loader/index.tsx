import React, { type FC } from "react";

import css from "./style.module.scss";

interface Props {
  children?: React.ReactNode;
}
export const Loader: FC<Props> = ({}) => {
  return (
    <div>
      <span className={css.loader}></span>
    </div>
  );
};
