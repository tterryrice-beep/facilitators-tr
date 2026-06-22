import React, {
  type CSSProperties,
  type TransitionEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";

import { overlay } from "../utils";
import { OverlayPosition, type OverlayProps } from "./type";

const ANIMATION_MS = 200;

/* ─────────────────────────── Helpers ─────────────────────────── */

const isOverlayPosition = (v: unknown): v is OverlayPosition =>
  typeof v === "number" && OverlayPosition[v as OverlayPosition] !== undefined;

const resolveAnchorElement = (
  anchor: OverlayProps["anchor"],
): HTMLElement | null => {
  if (anchor == null) return null;
  if (isOverlayPosition(anchor)) return null;
  if (typeof anchor === "string") {
    return document.querySelector<HTMLElement>(anchor);
  }
  return anchor;
};

/**
 * Returns absolute top/left for a content box anchored to `target`.
 * Prefers placing below the target; falls back to whichever side has
 * more vertical space when the content does not fit below.
 * Horizontally clamps the box inside the viewport.
 */
const computeAnchoredPosition = (
  target: HTMLElement,
  content: HTMLElement,
): CSSProperties => {
  const rect = target.getBoundingClientRect();
  const contentH = content.offsetHeight;
  const contentW = content.offsetWidth;
  const vpH = window.innerHeight;
  const vpW = window.innerWidth;

  const spaceBelow = vpH - rect.bottom;
  const spaceAbove = rect.top;

  let top: number;
  if (contentH <= spaceBelow) {
    top = rect.bottom;
  } else if (spaceAbove > spaceBelow) {
    // not enough space below — place above, clamp inside viewport.
    top = Math.max(0, rect.top - contentH);
  } else {
    top = Math.max(0, Math.min(rect.bottom, vpH - contentH));
  }

  let left = rect.left;
  if (left + contentW > vpW) left = Math.max(0, vpW - contentW);
  if (left < 0) left = 0;

  return { position: "absolute", top, left };
};

const positionFromOverlayPosition = (
  pos: OverlayPosition,
): CSSProperties | undefined => {
  switch (pos) {
    case OverlayPosition.TOP:
      return { position: "absolute", top: 0 };
    case OverlayPosition.BOTTOM:
      return { position: "absolute", bottom: 0 };
    case OverlayPosition.LEFT:
      return { position: "absolute", left: 0 };
    case OverlayPosition.RIGHT:
      return { position: "absolute", right: 0 };
    case OverlayPosition.CENTER:
    default:
      // Centered by the flex wrapper — no per-side overrides.
      return undefined;
  }
};

/* ─────────────────────────── Component ─────────────────────────── */

export const Overlay: React.FC<OverlayProps> = ({
  children,
  withoutBlind,
  anchor,
  isOpen,
  onClose,
  classes,
}) => {
  /** Stays mounted while either `isOpen` is true or the close animation is running. */
  const [mounted, setMounted] = useState<boolean>(!!isOpen);
  /** Drives the opacity transition (0 → 1 / 1 → 0). */
  const [visible, setVisible] = useState<boolean>(false);
  /** Toggled to `true` only after the open animation has finished. */
  const [interactable, setInteractable] = useState<boolean>(false);
  /** Inline styles used to position the content box. */
  const [contentPos, setContentPos] = useState<CSSProperties | undefined>(
    undefined,
  );
  /** True once we have measured / placed the content at least once. */
  const [placed, setPlaced] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement | null>(null);
  /** Latest resolved anchor element (for string / HTMLElement variants). */
  const anchorElRef = useRef<HTMLElement | null>(null);
  /** Set when an in-component action requested closing; consumed on transition end. */
  const pendingCloseRef = useRef<boolean>(false);

  /** Begin the fade-out animation; `onClose` will fire after it completes. */
  const requestClose = useCallback(() => {
    pendingCloseRef.current = true;
    setInteractable(false);
    setVisible(false);
  }, []);

  const isAnchorless = anchor == null;
  const isPositionAnchor = isOverlayPosition(anchor);

  /* ── Mount on `isOpen=true`; unmount happens after fade-out ── */
  useEffect(() => {
    if (isOpen && !isAnchorless) {
      // eslint-disable-next-line
      setMounted(true);
    }
  }, [isOpen, isAnchorless]);

  /* ── Trigger fade-out when closed (or anchor becomes null) ── */
  useEffect(() => {
    if (!isOpen || isAnchorless) {
      // eslint-disable-next-line
      setInteractable(false);
      setVisible(false);
    }
  }, [isOpen, isAnchorless]);

  /* ── Compute / recompute position once content is in DOM ── */
  const measureAndPlace = useCallback(() => {
    if (!mounted || !isOpen || isAnchorless) return;

    if (isPositionAnchor) {
      setContentPos(positionFromOverlayPosition(anchor as OverlayPosition));
      setPlaced(true);
      return;
    }

    const target = resolveAnchorElement(anchor);
    anchorElRef.current = target;
    const content = contentRef.current;
    if (!target || !content) return;

    setContentPos(computeAnchoredPosition(target, content));
    setPlaced(true);
  }, [anchor, isAnchorless, isOpen, isPositionAnchor, mounted]);

  // Measure synchronously after children are committed to the DOM, so we
  // never paint at the wrong position.
  useLayoutEffect(() => {
    // eslint-disable-next-line
    measureAndPlace();
  }, [measureAndPlace, children]);

  /* ── Reposition on viewport changes while open ── */
  useEffect(() => {
    if (!mounted || isAnchorless || isPositionAnchor) return;
    const onChange = () => measureAndPlace();
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, true);
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange, true);
    };
  }, [mounted, isAnchorless, isPositionAnchor, measureAndPlace]);

  /* ── Once placed (and we should be open), kick off the fade-in ── */
  useEffect(() => {
    if (!mounted || !isOpen || isAnchorless || !placed) return;
    // rAF so the browser commits the initial opacity:0 frame before
    // we toggle it to 1, otherwise the transition is skipped.
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [mounted, isOpen, isAnchorless, placed]);

  /* ── React to the end of the opacity animation ── */
  const handleTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "opacity") return;
    if (e.currentTarget !== e.target) return; // ignore bubbling from children

    if (visible) {
      // open animation finished → allow interactions
      setInteractable(true);
    } else {
      // close animation finished → drop from the DOM and reset
      setMounted(false);
      setPlaced(false);
      setContentPos(undefined);
      if (pendingCloseRef.current) {
        pendingCloseRef.current = false;
        onClose?.();
      }
    }
  };

  /* ── Don't render anything when there's nothing to show ── */
  if (isAnchorless) return null;
  if (!mounted) return null;

  return overlay(
    <div
      role="overlay-wrapper"
      className={clsx(
        "fixed inset-0 z-30 flex items-center justify-center w-full h-full pointer-events-none",
        classes?.wrapper,
      )}>
      {!withoutBlind && (
        <div
          role="overlay-blind"
          onClick={requestClose}
          className={clsx(
            "absolute inset-0 z-1 bg-black/50 transition-opacity duration-200 ease-in-out",
            visible ? "opacity-100" : "opacity-0",
            interactable ? "pointer-events-auto" : "pointer-events-none",
            classes?.blind,
          )}
        />
      )}

      <div
        ref={contentRef}
        role="overlay-content"
        onTransitionEnd={handleTransitionEnd}
        style={{
          ...contentPos,
          // Hide before the first measurement to avoid a flash at (0, 0).
          visibility: placed ? "visible" : "hidden",
          transitionDuration: `${ANIMATION_MS}ms`,
        }}
        className={clsx(
          // Scrolling not supported here. All scroll preferences should be handled by the child component
          "z-2 overflow-hidden transition-opacity ease-in-out",
          visible ? "opacity-100" : "opacity-0",
          interactable ? "pointer-events-auto" : "pointer-events-none",
          // Default to relative-stacked unless an explicit positioning rule was applied.
          contentPos?.position ? "" : "relative",
          classes?.content,
        )}>
        {children}
      </div>
    </div>,
  );
};
