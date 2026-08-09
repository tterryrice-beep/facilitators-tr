// enum has number values because we need to distinguish them from string
export enum OverlayPosition {
  CENTER = 0,
  TOP = 1,
  BOTTOM = 2,
  LEFT = 3,
  RIGHT = 4,
}

export interface OverlayProps {
  children?: React.ReactNode;
  withoutBlind?: boolean;
  anchor?:
    | HTMLElement
    | null
    | OverlayPosition
    | string // string => querySelectorText
    | { current: HTMLElement | null };
  isOpen?: boolean;
  onClose?: () => void;

  classes?: {
    wrapper?: string;
    blind?: string;
    content?: string;
  };
}
