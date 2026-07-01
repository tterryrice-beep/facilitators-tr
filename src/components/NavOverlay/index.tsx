import React, { Fragment, useRef, useState, type FC } from "react";
import clsx from "clsx";

import { NavLink, type ModalPath, type PagePath } from "@/providers/Router";
import { Text } from "@@/Text";
import { Overlay } from "@@/overlays";
import { Button } from "@@/Button";

export interface NavOverlayItem {
  name?: string;
  page?: PagePath;
  modal?: ModalPath;
  breadcrumbs?: string[];
}

export interface NavOverlayProps extends NavOverlayItem {
  sections?: NavOverlayItem[];
}

export const NavOverlay: FC<NavOverlayProps> = ({
  name,
  page,

  modal,
  breadcrumbs,
  sections,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const root = useRef<HTMLDivElement | null>(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <div
      ref={root}
      className="h-18"
      onMouseOver={open}
      onMouseEnter={open}
      onMouseLeave={close}>
      <Button className="h-full w-full flex items-center justify-center gap-1">
        <NavLink
          className="px-6 h-full w-full"
          to={page}
          modal={modal}
          modalBreadCrumbs={breadcrumbs}
          onClick={close}>
          <Text>{name}</Text>
        </NavLink>
      </Button>

      <Overlay isOpen={isOpen} onClose={close} withoutBlind anchor={root}>
        <div className="flex flex-col gap-2 bg-cyan-950 rounded-lg p-0 overflow-hidden">
          {sections?.map(({ name, page, modal, breadcrumbs }) => {
            return (
              <Fragment key={clsx(name, page, modal, breadcrumbs?.join("-"))}>
                <NavLink
                  to={page}
                  modal={modal}
                  modalBreadCrumbs={breadcrumbs}
                  onClick={close}
                  className="rounded-none p-3 hover:bg-cyan-800 transition-colors duration-200">
                  <Text>{name}</Text>
                </NavLink>
              </Fragment>
            );
          })}
        </div>
      </Overlay>
    </div>
  );
};
