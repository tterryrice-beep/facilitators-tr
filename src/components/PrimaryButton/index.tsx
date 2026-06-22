import React, { type FC } from "react";

import { Button } from "@@/Button";
import type { BaseButtonProps } from "@@/Button/type";

export const PrimaryButton: FC<BaseButtonProps> = ({ className, ...props }) => {
  return (
    <Button
      {...props}
      className={
        className +
        " bg-zinc-600 hover:bg-zinc-500 active:bg-zinc-600 transition-colors px-4 py-2 rounded font-bold text-white "
      }
    />
  );
};
