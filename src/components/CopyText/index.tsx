import React, { type FC } from "react";
import { toast } from "react-toastify";
import clsx from "clsx";

import { type TextProps, Text } from "@@/Text/";
import { copy } from "@/utils/copy";

interface Props extends TextProps<"span"> {
  children?: string;
}

export const CopyText: FC<Props> = ({
  children,
  className,
  onClick,
  ...props
}) => {
  return (
    <Text
      {...props}
      className={clsx(
        className,
        "cursor-copy hover:underline active:opacity-65",
      )}
      onClick={async (e) => {
        onClick?.(e);
        if (!children) return;
        const success = await copy(children);
        if (success) toast.success("Copied!", { autoClose: 500 });
        else toast.warning("Failed to copy", { autoClose: 1000 });
      }}>
      {children}
    </Text>
  );
};
