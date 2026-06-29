import React, {
  Children,
  Fragment,
  useEffect,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from "react";
import clsx from "clsx";

import Arrow from "assets/icons/main/arr-down.svg?react";
import { Button } from "@@/Button";
import { Overlay } from "@@/overlays";
import css from "./style.module.scss";

export interface SelectProps {
  children?: ReactNode;

  index: number;
  setIndex: (v: number) => void;
}

export const Select: FC<SelectProps> = ({ children, index, setIndex }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = React.Children.map(children, (child) => child) || [];
  return (
    <div>
      <Button>
        {options[index]}

        <Arrow />
      </Button>

      <Overlay>{options}</Overlay>
    </div>
  );
};
