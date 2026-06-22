import React, { type FC } from "react";
import { PathProvider } from "./PathProvider";

interface Props {
  children?: React.ReactNode;
}

export const RouterProvider: FC<Props> = ({ children }) => {
  return <PathProvider>{children}</PathProvider>;
};
