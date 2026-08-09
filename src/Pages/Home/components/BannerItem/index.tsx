import { NavLink, type PagePath } from "@/providers/Router";
import clsx from "clsx";
import React, { type FC, type ReactNode } from "react";

import { Text } from "@@/Text";
import css from "./style.module.scss";

interface Props {
  title?: ReactNode;
  banner?: ReactNode;
  discribe?: ReactNode;
  to?: PagePath;
}

export const BannerItem: FC<Props> = ({ banner, discribe, title, to }) => {
  return (
    <>
      <NavLink className={clsx("p-2 rounded-sm", css.item)} to={to}>
        <Text type="text" className="text-teal-400 block">
          {title}
        </Text>
        <div className="flex flex-col gap-8 mt-2 sm:flex-row">
          <div className="flex justify-center items-center">{banner}</div>
          <div className="">
            <Text type="small" className="block text-xs">
              {discribe}
            </Text>
          </div>
        </div>
      </NavLink>
    </>
  );
};
