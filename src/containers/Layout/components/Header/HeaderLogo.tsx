import React, { type FC } from "react";

/**
 * Brand logo block. Light-theme variant was dropped (project is dark-only).
 */
export const HeaderLogo: FC = () => {
  return (
    <div className="aywh ayxn">
      <a href="./home-01.html" className="aywl ayxp">
        <img
          src="https://assets.tailwindplus.com/logos/oatmeal-instrument.svg?color=white"
          alt="Oatmeal"
          width={85}
          height={28}
        />
      </a>
    </div>
  );
};
