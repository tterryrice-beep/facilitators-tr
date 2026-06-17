import React, { type FC, type AnchorHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

import { ChevronRightIcon } from "./icons";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  /** Hide the trailing chevron (useful for primary CTA-like links). */
  withoutChevron?: boolean;
}

/**
 * Single navigation link used inside the header (both desktop & mobile menu).
 * Renders the label and a small chevron on the right.
 */
export const NavLink: FC<Props> = ({
  children,
  className,
  withoutChevron = false,
  ...rest
}) => {
  return (
    <a
      {...rest}
      className={clsx(
        "azbs aywl ayxn ayxq ayxu azaf azao azfa azfu azaw",
        className,
      )}>
      {children}
      {!withoutChevron && (
        <span
          className="aywl ayzk azba azbr azen"
          aria-hidden="true">
          <ChevronRightIcon />
        </span>
      )}
    </a>
  );
};
