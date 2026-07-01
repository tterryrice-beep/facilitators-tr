import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export interface BaseButtonProps extends Omit<
  ButtonProps,
  "aria-label" | "ref"
> {
  children?: React.ReactNode;
  ariaLabel?: string;
  waveColor?: string;
}
