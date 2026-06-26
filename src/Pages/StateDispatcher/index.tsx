import React, { type FC, useState } from "react";

import css from "./style.module.scss";
import { Heading } from "@@/Heading";

const Page: FC = ({}) => {
  return (
    <section className={css.page}>
      <Heading
        title={"StateDispatcher"}
        rightBar={
          <div className="flex gap-3 items-center">
            <a href="https://github.com/tterryrice-beep/StateDispatcher">
              <img
                src="https://cdn.simpleicons.org/github/white"
                alt="git"
                className="h-6 w-auto"
              />
            </a>
            <a href="https://www.npmjs.com/package/state-dispatcher-red">
              <img
                src="https://img.shields.io/npm/v/state-dispatcher-red"
                alt="npm version"
              />
            </a>
          </div>
        }
      />
      <div></div>
    </section>
  );
};

export default Page;
