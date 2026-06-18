import React from "react";
import { overlay } from "../utils";
import type { OverlayProps } from "./type";

import css from "./style.module.scss";
import clsx from "clsx";

export const Overlay: React.FC<OverlayProps> = ({
  children,
  withoutBlind,
  anchor,
  isOpen,
  onClose,
  classes,
}) => {
  // return null;

  return overlay(
    <>
      <div
        role="overlay-wrapper"
        className={clsx(
          "fixed top-0 left-0 inset-0 flex items-center justify-center w-full h-full pointer-events-none z-30",
          classes?.wrapper,
        )}>
        {!withoutBlind && (
          <div
            role="overlay-blind"
            className={clsx(
              "absolute top-0 left-0 inset-0 bg-black/50 pointer-events-auto z-1",
              classes?.blind,
            )}
            onClick={onClose}
          />
        )}
        <div
          // Scrolling not supported here. All scroll preferences should be handled by the child component
          className={clsx("relative z-2 overflow-hidden", classes?.content)}
          role="overlay-content">
          {children}
        </div>
      </div>
    </>,
  );
};
