import React, { type FC } from "react";

interface Props {}

import css from "./style.module.scss";
import { PathRouterContainer } from "@/modules";
import { route } from "@/config";
import { Footer, Header } from "./components";

export const Layout: FC<Props> = ({}) => {
  return (
    <div className="bg-mist-900 p-0 m-0 min-h-screen flex flex-col">
      <Header />
      <main className="p-4 md:p-6 flex-1">
        <PathRouterContainer
          config={route}
          fallback={<>Усе ок, ми завантажуємося</>}
        />
      </main>
      <Footer />
    </div>
  );
};
