import type { HTMLAttributes, ReactNode } from "react";

export type TextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p";
export type TextType = "title" | "subtitle" | "text" | "small";

export type TextElement<T extends TextTag> = HTMLElementTagNameMap[T];

export interface TextProps<T extends TextTag> extends HTMLAttributes<
  TextElement<T>
> {
  children?: ReactNode;
  tag?: T;
  type?: TextType;
}
