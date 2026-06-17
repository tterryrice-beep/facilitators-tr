import React, { type FC } from "react";

import { NavLink } from "./NavLink";
import { headerNavItems } from "./navItems";

/**
 * Desktop navigation links cluster (left side of the header).
 */
export const HeaderNavLinks: FC = () => {
  return (
    <div className="aywh ayxg ayxy azdj">
      {headerNavItems.map((item) => (
        <NavLink
          key={item.label}
          href={item.href}
          className={item.extraClassName}>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
};
