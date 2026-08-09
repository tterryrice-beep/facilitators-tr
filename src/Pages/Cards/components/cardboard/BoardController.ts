import type {
  CellCoord,
  CameraState,
  ViewportSize,
  ScreenPoint,
} from "./types";
import { Camera } from "./Camera";
import { ZOOM_DEFAULT, ARROW_CELL_STEP } from "./constants";

/**
 * Holds the mutable board/camera state and exposes methods
 * for all user interactions (zoom, pan, arrow keys, anchor drag).
 */
export class BoardController {
  camera: CameraState;

  /** Cell used as the drag anchor, or null when not dragging */
  anchorCell: CellCoord | null = null;

  constructor() {
    this.camera = { x: 0, y: 0, zoom: ZOOM_DEFAULT };
  }

  // ── Zoom ──────────────────────────────────────────────────────────

  /** Zoom at a screen point (called on mouse wheel) */
  zoomAt(vp: ViewportSize, screenPoint: ScreenPoint, delta: number): void {
    this.camera = Camera.zoomAt(this.camera, vp, screenPoint, delta);
  }

  // ── Arrow-key pan ─────────────────────────────────────────────────

  panByCells(cellsX: number, cellsY: number): void {
    this.camera = Camera.panByCells(this.camera, cellsX, cellsY);
  }

  /** Apply arrow key (returns true if handled) */
  handleArrowKey(key: string): boolean {
    switch (key) {
      case "ArrowUp":
        this.panByCells(0, -ARROW_CELL_STEP);
        return true;
      case "ArrowDown":
        this.panByCells(0, ARROW_CELL_STEP);
        return true;
      case "ArrowLeft":
        this.panByCells(-ARROW_CELL_STEP, 0);
        return true;
      case "ArrowRight":
        this.panByCells(ARROW_CELL_STEP, 0);
        return true;
      default:
        return false;
    }
  }

  // ── Mouse-drag pan (anchor cell) ──────────────────────────────────

  /** Begin anchor drag at a screen point. Sets the anchor cell. */
  startDrag(vp: ViewportSize, screenPoint: ScreenPoint): void {
    this.anchorCell = Camera.screenToCell(screenPoint, this.camera, vp);
  }

  /** Continue anchor drag with current mouse position */
  dragMove(vp: ViewportSize, mouseX: number, mouseY: number): void {
    if (!this.anchorCell) return;
    this.camera = Camera.panWithAnchor(
      this.camera,
      vp,
      this.anchorCell.x,
      this.anchorCell.y,
      mouseX,
      mouseY,
    );
  }

  /** End anchor drag */
  endDrag(): void {
    this.anchorCell = null;
  }

  /** Whether the user is currently dragging */
  get isDragging(): boolean {
    return this.anchorCell !== null;
  }

  // ── Cell lookup ───────────────────────────────────────────────────

  /** Get the cell under a screen point */
  getCellAt(vp: ViewportSize, screenPoint: ScreenPoint): CellCoord {
    return Camera.screenToCell(screenPoint, this.camera, vp);
  }
}
