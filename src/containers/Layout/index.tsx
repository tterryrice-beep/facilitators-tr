import React, { Fragment, type FC } from "react";

interface Props {}

import { Overlay, OverlayPosition } from "@@/overlays";
import { ErrorBoundary } from "@@/ErrorBoundary";
import { Loader } from "@@/Loader";

import { PagesContainer } from "../../providers/Router";
import { Footer, Header } from "./components";
import css from "./style.module.scss";

export const Layout: FC<Props> = ({}) => {
  return (
    <div className="bg-mist-900 p-0 m-0 min-h-screen  flex flex-col">
      <Header />
      <main className="p-4 md:p-6 flex-1 max-w-6xl mx-auto w-full">
        <ErrorBoundary>
          <PagesContainer
            fallback={
              <>
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                  <Loader />
                </div>
              </>
            }
            ModalWrapper={({ isOpen, onClose, children, key, modalName }) => {
              return (
                <Fragment key={`${key}-${modalName || "unknown"}`}>
                  <Overlay
                    isOpen={isOpen}
                    onClose={onClose}
                    anchor={OverlayPosition.CENTER}>
                    {children}
                  </Overlay>
                </Fragment>
              );
            }}
          />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};
