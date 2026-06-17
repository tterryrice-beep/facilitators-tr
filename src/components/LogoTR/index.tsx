import { Button } from "@@/Button";
import React, { type FC } from "react";

interface Props {}
export const LogoTR: FC<Props> = ({}) => {
  return (
    <Button className="flex items-center justify-center rounded-full bg-teal-600 w-12 h-12">
      <span className="text-2xl font-black">T</span>
    </Button>
  );
};
