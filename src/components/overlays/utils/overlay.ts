import { createPortal } from "react-dom";

const OVERLAYS_ID = "overlays";

const prepareOverlays = (): HTMLElement => {
  const overlaysRoot = document.getElementById(OVERLAYS_ID);
  if (overlaysRoot) return overlaysRoot;

  const newOverlays = document.createElement("div");
  newOverlays.id = OVERLAYS_ID;
  document.body.appendChild(newOverlays);
  return newOverlays as HTMLElement;
};

export const overlay = (node: React.ReactNode) => {
  return createPortal(node, prepareOverlays());
};
