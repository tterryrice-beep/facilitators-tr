import React, { type FC, type HTMLAttributes } from "react";
import clsx from "clsx";

type PreProps = HTMLAttributes<HTMLPreElement>;

interface Props {
  children?: React.ReactNode;
  inline?: boolean;

  props?: PreProps;
}
export const Pre: FC<Props> = ({ children, inline = false, props }) => {
  return (
    <pre
      {...props}
      className={clsx(
        "text-orange-400 whitespace-pre-wrap break-words",
        props?.className,
        {
          inline,
        },
      )}>
      {children}
    </pre>
  );
};
