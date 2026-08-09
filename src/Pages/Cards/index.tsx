import React, { type FC } from "react";
import BoardCanvas from "./components/cardboard/BoardCanvas";
import "./style.scss";

const Page: FC = () => {
  return (
    <section className={"page"}>
      <BoardCanvas />
    </section>
  );
};

export default Page;
