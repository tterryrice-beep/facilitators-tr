import React, { type FC } from "react";

interface Props {}

import { PathRouterContainer } from "../../providers/Router";
import { Footer, Header } from "./components";
import css from "./style.module.scss";

export const Layout: FC<Props> = ({}) => {
  return (
    <div className="bg-mist-900 p-0 m-0 min-h-screen flex flex-col">
      <Header />
      <main className="p-4 md:p-6 flex-1 max-w-7xl mx-auto w-full">
        <PathRouterContainer fallback={<>Усе ок, ми завантажуємося</>} />
      </main>
      <Footer />
    </div>
  );
};
