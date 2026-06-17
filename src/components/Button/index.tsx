import React, { forwardRef } from "react";
import clsx from "clsx";

import css from "./style.module.scss";
import type { BaseButtonProps } from "./type";

export const Button = forwardRef<HTMLButtonElement, BaseButtonProps>(
  (
    {
      children,
      onClick,
      className,
      ariaLabel = "button",
      waveColor = "--txta",
      ...rest
    },
    ref,
  ) => {
    const animationClick = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      if (onClick) onClick(event);

      const { clientX, clientY, currentTarget: button } = event;
      const { left, top } = button.getBoundingClientRect();
      const wave = document.createElement("span");

      const position = window
        .getComputedStyle(button)
        .getPropertyValue("position");
      const isStatic = position === "static";

      if (isStatic) {
        button.style.position = "relative";
      }

      let waveWrapper = button.querySelector(css.baseButton_waveWrapper);
      if (!waveWrapper) {
        waveWrapper = document.createElement("div");
        waveWrapper.className = css.baseButton_waveWrapper;
        button.appendChild(waveWrapper);
      }

      const { offsetWidth, offsetHeight } = button;
      const waveSize = Math.max(offsetWidth, offsetHeight) * 2;

      wave.className = css.baseButton_wave;
      waveWrapper.appendChild(wave);
      wave.style.setProperty("--wave-scale", `${waveSize}`);
      wave.style.left = `${clientX - left}px`;
      wave.style.top = `${clientY - top}px`;
      wave.style.backgroundColor = waveColor;

      const onWave = () => {
        wave.removeEventListener("animationend", onWave);
        wave.remove();

        if (isStatic) {
          button.style.position = "";
        }

        if (!waveWrapper?.children.length) {
          waveWrapper?.remove();
        }
      };
      wave.addEventListener("animationend", onWave);
    };

    return (
      <button
        {...rest}
        ref={ref}
        aria-label={ariaLabel}
        className={clsx(css.baseButton, className)}
        onClick={animationClick}>
        {children}
      </button>
    );
  },
);
