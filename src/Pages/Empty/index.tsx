import React, { type FC } from "react";
import { Overlay, OverlayPosition } from "@@/overlays";

import css from "./style.module.scss";

export const Page: FC = ({}) => {
  return (
    <section className={css.page}>
      <div>Page Content</div>

      <Overlay isOpen={true} anchor={OverlayPosition.CENTER} onClose={() => {}}>
        <div className="bg-green-500">Overlay Content</div>
      </Overlay>
    </section>
  );
};
