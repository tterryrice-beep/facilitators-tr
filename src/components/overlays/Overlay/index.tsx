import React from "react";
import { overlay } from "../utils";
import type { OverlayProps } from "./type";

export const Overlay: React.FC<OverlayProps> = ({
  children,
  withoutBlind,
  anchor,
  isOpen,
  onClose,
}) => {
  return overlay(
    <>
      <div
        role="overlay-wrapper"
        className="fixed top-0 left-0 inset-0 flex items-center justify-center w-full h-full pointer-events-none z-30">
        {!withoutBlind && (
          <div
            role="overlay-blind"
            className="absolute top-0 left-0 inset-0 bg-black/50 pointer-events-auto z-1"
            onClick={onClose}
          />
        )}
        <div className="pointer-events-auto relative z-2" role="overlay-content">
          {children}
        </div>
      </div>
    </>,
  );
};
