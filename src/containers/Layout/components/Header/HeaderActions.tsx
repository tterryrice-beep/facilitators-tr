import React, { type FC } from "react";

import { MenuIcon } from "./icons";

/**
 * Right-side cluster of the header:
 *  - desktop "Log in" / "Get started" buttons
 *  - mobile menu toggle (opens #mobile-menu dialog)
 */
export const HeaderActions: FC = () => {
  return (
    <div className="aywh ayxg ayxn ayxs ayxv">
      <div className="aywh ayxh ayxn ayxw">
        <a
          href="#"
          className="aywl ayxh ayxn ayxr azam azao ayxu ayyo azfu azgg azaw azcv ayzo ayzs azdl">
          Log in
        </a>
        <a
          href="#"
          className="aywl ayxh ayxn ayxr azam azao ayxt ayyo azax ayza azcu azfk azft azgf ayzo ayzs">
          Get started
        </a>
      </div>

      <button
        {...({ command: "show-modal", commandfor: "mobile-menu" } as Record<
          string,
          string
        >)}
        aria-label="Toggle menu"
        aria-expanded="false"
        className="aywl ayyo ayzk azen azfu azgg azaw azcv">
        <MenuIcon />
      </button>
    </div>
  );
};
