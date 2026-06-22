import React, { type FC } from "react";
import type { ModalProps } from "@/modules";
import { usePath } from "@/providers/Router";
import css from "./style.module.scss";

export const Modal: FC<ModalProps> = ({ onClose }) => {
  return <div>Modal</div>;
};
