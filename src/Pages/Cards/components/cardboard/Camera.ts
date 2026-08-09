import type {
  ScreenPoint,
  WorldPoint,
  CameraState,
  ViewportSize,
  CellCoord,
} from "./types";
import { CELL_SIZE, ZOOM_MIN, ZOOM_MAX, ZOOM_FACTOR } from "./constants";

/**
 * Pure-math camera: screen ↔ world coordinate conversion, zoom, pan.
 * Stateless — callers pass current camera & viewport explicitly.
 */
export const Camera = {
  // ── Screen ↔ World ──────────────────────────────────────────────────

  /** Convert a screen-pixel point to world coordinates */
  screenToWorld(
    screen: ScreenPoint,
    cam: CameraState,
    vp: ViewportSize,
  ): WorldPoint {
    return {
      x: cam.x + (screen.x - vp.width / 2) / cam.zoom,
      y: cam.y + (screen.y - vp.height / 2) / cam.zoom,
    };
  },

  /** Convert a world point to screen-pixel coordinates */
  worldToScreen(
    world: WorldPoint,
    cam: CameraState,
    vp: ViewportSize,
  ): ScreenPoint {
    return {
      x: vp.width / 2 + (world.x - cam.x) * cam.zoom,
      y: vp.height / 2 + (world.y - cam.y) * cam.zoom,
    };
  },

  // ── Cell ↔ World ────────────────────────────────────────────────────

  /** World coords of the top-left corner of a cell */
  cellToWorld(cx: number, cy: number): WorldPoint {
    return { x: cx * CELL_SIZE, y: cy * CELL_SIZE };
  },

  /** World coords of the center of a cell */
  cellCenterToWorld(cx: number, cy: number): WorldPoint {
    return {
      x: cx * CELL_SIZE + CELL_SIZE / 2,
      y: cy * CELL_SIZE + CELL_SIZE / 2,
    };
  },

  /** Given a world point, return the cell coordinate containing it */
  worldToCell(wx: number, wy: number): CellCoord {
    return {
      x: Math.floor(wx / CELL_SIZE),
      y: Math.floor(wy / CELL_SIZE),
    };
  },

  /** Given a screen point, return the cell coordinate beneath it */
  screenToCell(
    screen: ScreenPoint,
    cam: CameraState,
    vp: ViewportSize,
  ): CellCoord {
    const w = Camera.screenToWorld(screen, cam, vp);
    return Camera.worldToCell(w.x, w.y);
  },

  // ── Zoom ────────────────────────────────────────────────────────────

  /**
   * Zoom centered on a screen point.
   * Returns a new camera state — does NOT mutate the original.
   */
  zoomAt(
    cam: Readonly<CameraState>,
    vp: ViewportSize,
    screenPoint: ScreenPoint,
    delta: number, // positive = zoom in, negative = zoom out
  ): CameraState {
    const factor = delta > 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
    const newZoom = clamp(cam.zoom * factor, ZOOM_MIN, ZOOM_MAX);

    // World point that should stay fixed under the cursor
    const worldBefore = Camera.screenToWorld(screenPoint, cam, vp);

    // Adjust camera so the same world point remains under the cursor
    return {
      x: worldBefore.x - (screenPoint.x - vp.width / 2) / newZoom,
      y: worldBefore.y - (screenPoint.y - vp.height / 2) / newZoom,
      zoom: newZoom,
    };
  },

  // ── Pan ─────────────────────────────────────────────────────────────

  /** Pan camera by a screen-pixel delta (drag direction) */
  panByScreen(cam: Readonly<CameraState>, dx: number, dy: number): CameraState {
    return {
      ...cam,
      x: cam.x - dx / cam.zoom,
      y: cam.y - dy / cam.zoom,
    };
  },

  /** Pan camera by world units */
  panByWorld(cam: Readonly<CameraState>, dx: number, dy: number): CameraState {
    return { ...cam, x: cam.x - dx, y: cam.y - dy };
  },

  /** Pan camera by an exact number of cells */
  panByCells(
    cam: Readonly<CameraState>,
    cellsX: number,
    cellsY: number,
  ): CameraState {
    return {
      ...cam,
      x: cam.x - cellsX * CELL_SIZE,
      y: cam.y - cellsY * CELL_SIZE,
    };
  },

  /**
   * Anchor-cell drag pan.
   * Moves the camera so the anchor-cell center follows the mouse,
   * clamped to stay within the viewport.
   */
  panWithAnchor(
    cam: Readonly<CameraState>,
    vp: ViewportSize,
    anchorCx: number,
    anchorCy: number,
    mouseX: number,
    mouseY: number,
  ): CameraState {
    // Clamp mouse to viewport bounds
    const tx = clamp(mouseX, 0, vp.width);
    const ty = clamp(mouseY, 0, vp.height);

    const anchorWorld = Camera.cellCenterToWorld(anchorCx, anchorCy);

    return {
      x: anchorWorld.x - (tx - vp.width / 2) / cam.zoom,
      y: anchorWorld.y - (ty - vp.height / 2) / cam.zoom,
      zoom: cam.zoom,
    };
  },
} as const;

// ── helpers ────────────────────────────────────────────────────────────
function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
