import React, { type FC } from "react";
import { PathProvider } from "./PathProvider";

interface Props {
  children?: React.ReactNode;
}

export const RouterProvider: FC<Props> = ({ children }) => {
  return (
    <PathProvider basename={import.meta.env.BASE_URL || "/"}>
      {children}
    </PathProvider>
  );
};
