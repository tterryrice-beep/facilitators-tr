// ── Coordinate types ──────────────────────────────────────────────────

/** A point in screen pixel space */
export interface ScreenPoint {
  x: number;
  y: number;
}

/** A point in world space (continuous, 1 unit = 1px at 100% zoom) */
export interface WorldPoint {
  x: number;
  y: number;
}

/** Cell coordinate on the logical grid */
export interface CellCoord {
  /** Column index: negative = left of origin, positive = right */
  x: number;
  /** Row index: negative = above origin, positive = below */
  y: number;
}

/** A single cell on the board grid */
export interface Cell extends CellCoord {
  /** ID of the card occupying this cell, or null if empty */
  cardId: string | null;
}

/** Camera state — determines which portion of the board is visible */
export interface CameraState {
  /** World X coordinate mapped to the screen center */
  x: number;
  /** World Y coordinate mapped to the screen center */
  y: number;
  /** Scale factor: 1.0 = 100% (1 cell = 50px), 0.1 = min, 5.0 = max */
  zoom: number;
}

/** Sizing info for the canvas / viewport */
export interface ViewportSize {
  width: number;
  height: number;
}