// ── Grid ──────────────────────────────────────────────────────────────
/** World-unit size of a single grid cell */
export const CELL_SIZE = 50;

// ── Zoom ──────────────────────────────────────────────────────────────
/** Zoom at which 1 cell occupies 50 screen pixels (100 %) */
export const ZOOM_DEFAULT = 1.0;
/** Minimum zoom — 1 cell = 5 screen pixels */
export const ZOOM_MIN = 0.1;
/** Maximum zoom — 1 cell = 250 screen pixels */
export const ZOOM_MAX = 5.0;
/** Multiplicative factor per scroll-wheel tick */
export const ZOOM_FACTOR = 1.08;

// ── Interaction ───────────────────────────────────────────────────────
/** Number of cells the camera jumps per arrow-key press */
export const ARROW_CELL_STEP = 5;

// ── Cards ─────────────────────────────────────────────────────────────
/** Default card width in grid cells */
export const DEFAULT_CARD_WIDTH = 4;
/** Default card height in grid cells */
export const DEFAULT_CARD_HEIGHT = 4;

// ── Colors (hex numbers for PixiJS) ───────────────────────────────────
export const COLOR_BG = 0x1a1a2e;
export const COLOR_GRID_LINE = 0xffffff;
export const COLOR_GRID_MAJOR = 0xffffff;
export const COLOR_ANCHOR_CELL = 0x4a9eff;
export const ANCHOR_CELL_ALPHA = 0.3;

// ── Grid line alpha ───────────────────────────────────────────────────
export const GRID_LINE_ALPHA = 0.06;
export const GRID_MAJOR_ALPHA = 0.12;
/** Every Nth line is a "major" line */
export const MAJOR_EVERY = 5;