import clsx from "clsx";
import React, { type FC } from "react";

interface Props {
  children?: React.ReactNode;
  inline?: boolean;
}
export const Pre: FC<Props> = ({ children, inline = false }) => {
  return (
    <pre
      className={clsx("text-orange-400", {
        inline,
      })}>
      {children}
    </pre>
  );
};
