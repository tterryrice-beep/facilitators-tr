import React, { forwardRef, type ForwardedRef, type Ref } from "react";
import { clsx } from "clsx";

import type { TextElement, TextProps, TextTag } from "./type";
import css from "./style.module.scss";

const TextInner = <T extends TextTag>(
  { type, tag, children, className, ...props }: TextProps<T>,
  ref: ForwardedRef<TextElement<T>>,
) => {
  const Tag = (tag ?? "span") as React.ElementType;

  const getClassName = () => {
    switch (type) {
      case "title":
        return "text-2xl";
      case "subtitle":
        return "text-xl";
      case "caption":
        return "text-base";
      default:
      case "text":
        return "text-sm";
    }
  };

  return (
    <Tag
      ref={ref}
      className={clsx(css.text, className, getClassName())}
      {...props}>
      {children}
    </Tag>
  );
};

export const Text = forwardRef(TextInner) as <T extends TextTag = "span">(
  props: TextProps<T> & { ref?: Ref<TextElement<T>> },
) => React.ReactElement | null;
