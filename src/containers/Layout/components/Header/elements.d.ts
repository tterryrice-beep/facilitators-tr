import type { DetailedHTMLProps, HTMLAttributes } from "react";

type CustomElement<T extends HTMLElement = HTMLElement> = DetailedHTMLProps<
  HTMLAttributes<T>,
  T
>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "el-dialog": CustomElement;
      "el-dialog-panel": CustomElement;
    }
  }
}

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "el-dialog": CustomElement;
      "el-dialog-panel": CustomElement;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "el-dialog": CustomElement;
      "el-dialog-panel": CustomElement;
    }
  }
}

export {};
