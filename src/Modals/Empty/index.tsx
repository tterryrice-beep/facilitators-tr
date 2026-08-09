import React, { type FC } from "react";
import type { types } from "path-router-red";

import { usePath } from "@/providers/Router";
import css from "./style.module.scss";

const Modal: FC<types.ModalProps> = ({ onClose }) => {
  return <div>Modal</div>;
};

export default Modal;
