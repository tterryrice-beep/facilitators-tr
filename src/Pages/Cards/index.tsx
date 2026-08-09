/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState, type FC } from "react";
import { Button } from "@/components/Button";
import BoardCanvas from "./components/cardboard/BoardCanvas";
import SimpleLayout, { readSimpleCards } from "./components/SimpleLayout";
import "./style.scss";
import { Icon } from "@@/Icon";
import clsx from "clsx";

const Page: FC = () => {
  const [simpleMode, setSimpleMode] = useState(() => window.innerWidth <= 600);

  return (
    <section className="page">
      <div className="cardsModeHeader">
        <Button
          type="button"
          ariaLabel="Toggle simplified card view"
          className={clsx(
            `cardsModeButton ${simpleMode ? "enabled" : "disabled"}`,
            "center",
          )}
          onClick={() => setSimpleMode((value) => !value)}>
            <Icon name="main/List" />
        </Button>
      </div>
      {simpleMode ? <SimpleLayout /> : <BoardCanvas />}
    </section>
  );
};

export default Page;
