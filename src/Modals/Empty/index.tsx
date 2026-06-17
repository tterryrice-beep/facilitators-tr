import React, { type FC } from "react";
import { usePath, type ModalProps } from "@/modules";
import css from "./style.module.scss";

export const Modal: FC<ModalProps> = ({ onClose }) => {
  const {
    page: { navigate },
  } = usePath();

  navigate('');

  return <div>Modal</div>;
};
