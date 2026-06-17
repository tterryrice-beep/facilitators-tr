import React, { type FC } from "react";
import type { ModalProps } from "@/modules";
import { usePath } from "@/containers/Router";
import css from "./style.module.scss";

export const Modal: FC<ModalProps> = ({ onClose }) => {
  const {
    page: { navigate },
  } = usePath();

  navigate("about"); // typo working

  return <div>Modal</div>;
};
