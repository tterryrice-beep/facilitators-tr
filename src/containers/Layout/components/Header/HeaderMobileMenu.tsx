import React, { type FC } from "react";

import { CloseIcon } from "./icons";
import { NavLink } from "./NavLink";
import { headerNavItems } from "./navItems";

/**
 * Mobile menu dialog. Uses the experimental `el-dialog` / `el-dialog-panel`
 * web components paired with the new `command` / `commandfor` HTML invoker
 * attributes (Tailwind Plus pattern). Custom elements are declared in
 * `elements.d.ts`.
 */
export const HeaderMobileMenu: FC = () => {
  return (
    <el-dialog className="azen">
      <dialog
        id="mobile-menu"
        className="azcl"
        style={
          {
            right: "var(--el-top-layer-scrollbar-offset, 0px)",
          } as React.CSSProperties
        }>
        <el-dialog-panel className="ayvq ayvt ayzr ayzv azez ayyz azfl">
          <div className="aywh ayxs">
            <button
              {...({ command: "close", commandfor: "mobile-menu" } as Record<
                string,
                string
              >)}
              aria-label="Toggle menu"
              aria-expanded="false"
              className="aywl ayyo ayzk azfu azgg azaw azcv">
              <CloseIcon />
            </button>
          </div>

          <div className="aywg aywh ayxl ayxx">
            {headerNavItems.map((item) => (
              <NavLink
                key={item.label}
                href={item.href}
                className={item.extraClassName}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </el-dialog-panel>
      </dialog>
    </el-dialog>
  );
};
