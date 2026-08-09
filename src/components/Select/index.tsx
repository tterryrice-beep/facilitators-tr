import React, { Children, useState, type FC, type ReactNode } from "react";
import clsx from "clsx";

import { Icon } from "@@/Icon";
import { Button } from "@@/Button";
import { Overlay } from "@@/overlays";
import css from "./style.module.scss";

export interface SelectViewProps {
  index: number;
  setIndex: (v: number) => void;
  selectedOption: ReactNode;
  options: ReactNode[];
}

export interface SelectProps {
  children?: ReactNode;
  index: number;
  setIndex: (v: number) => void;
  View?: FC<SelectViewProps>;
}

export const Select: FC<SelectProps> = ({
  children,
  index,
  setIndex,
  View,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const options = Children.map(children, (child) => child) || [];
  const selectedOption = options[index] ?? null;

  const handleSelect = (i: number) => {
    setIndex(i);
    setIsOpen(false);
  };

  return (
    <div className={clsx(css.select)}>
      <Button
        ref={setAnchorEl}
        className={css.select__box + " text-white border border-gray-800"}
        onClick={() => setIsOpen((v) => !v)}>
        {View ? (
          <View
            index={index}
            setIndex={setIndex}
            selectedOption={selectedOption}
            options={options}
          />
        ) : (
          <span className={css.select__empty}>{selectedOption}</span>
        )}
        <Icon
          name="main/ArrowDown"
          props={{
            className: clsx(
              css.select__arrow,
              isOpen && css.select__arrow_active,
            ),
          }}
        />
      </Button>

      <Overlay
        anchor={anchorEl}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        classes={{
          blind: css.blind,
        }}>
        <div
          style={{
            //@ts-ignore
            "--select-width": (anchorEl?.clientWidth || 0) + "px",
          }}
          className={
            css.select__optionsWrapper +
            " border border-gray-800 text-white bg-gray-700"
          }>
          <div className={css.select__options}>
            {options.map((option, i) => (
              <button
                key={i}
                className={css.select__option + " text-white hover:bg-gray-600"}
                onClick={() => handleSelect(i)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      </Overlay>
    </div>
  );
};
