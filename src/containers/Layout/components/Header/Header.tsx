import React, { type FC } from "react";

import { HeaderLogo } from "./HeaderLogo";
import { HeaderNavLinks } from "./HeaderNavLinks";
import { HeaderActions } from "./HeaderActions";
import { HeaderMobileMenu } from "./HeaderMobileMenu";

/**
 * Top-level site header.
 *
 * Composition:
 *  - `HeaderNavLinks`  — desktop nav (Pricing / About / Docs / Log in)
 *  - `HeaderLogo`      — brand logo
 *  - `HeaderActions`   — desktop CTA buttons + mobile menu toggle
 *  - `HeaderMobileMenu`— mobile dialog with the same nav items
 *
 * Light-theme variants were intentionally stripped (project is dark-only).
 */
export const Header: FC = () => {
  return (
    <header className="ayvs ayvu ayvy ayyz azfl" id="navbar">
      <style>{`:root { --scroll-padding-top: 5.25rem }`}</style>

      <nav>
        <div className="aywb aywh aywp ayxc ayxn ayxv ayzr azez">
          <HeaderNavLinks />
          <HeaderLogo />
          <HeaderActions />
        </div>

        <HeaderMobileMenu />
      </nav>
    </header>
  );
};
