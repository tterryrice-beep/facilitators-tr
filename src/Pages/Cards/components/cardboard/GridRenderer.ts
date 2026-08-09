import { Container, Graphics } from 'pixi.js';
import type { CellCoord, CameraState, ViewportSize } from './types';
import { Camera } from './Camera';
import {
  CELL_SIZE, MAJOR_EVERY,
  COLOR_GRID_LINE, GRID_LINE_ALPHA,
  COLOR_GRID_MAJOR, GRID_MAJOR_ALPHA,
  COLOR_ANCHOR_CELL, ANCHOR_CELL_ALPHA,
} from './constants';

/**
 * PixiJS-based infinite grid renderer.
 * Only draws cells that are currently visible on screen.
 */
export class GridRenderer {
  readonly container = new Container();

  private gridGraphics: Graphics;
  private anchorGraphics: Graphics;
  private _visible = true;

  constructor() {
    this.gridGraphics = new Graphics();
    this.anchorGraphics = new Graphics();

    this.container.addChild(this.gridGraphics);
    this.container.addChild(this.anchorGraphics);
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(v: boolean) {
    this._visible = v;
    this.container.visible = v;
  }

  // ── Public API ──────────────────────────────────────────────────────

  /**
   * Redraws the visible portion of the grid.
   * @param cam    current camera state
   * @param vp     viewport dimensions
   * @param anchor optional anchor cell to highlight (during drag)
   */
  redraw(cam: CameraState, vp: ViewportSize, anchor?: CellCoord): void {
    this.drawGrid(cam, vp);
    this.drawAnchor(anchor, cam, vp);
  }

  /** Highlight the anchor cell (fills it with a semi-transparent color) */
  drawAnchor(anchor: CellCoord | undefined, cam: CameraState, vp: ViewportSize): void {
    this.anchorGraphics.clear();
    if (!anchor) return;

    const topLeft = Camera.cellToWorld(anchor.x, anchor.y);
    const screen = Camera.worldToScreen(topLeft, cam, vp);
    const cellScreenSize = CELL_SIZE * cam.zoom;

    this.anchorGraphics.beginFill(COLOR_ANCHOR_CELL, ANCHOR_CELL_ALPHA);
    this.anchorGraphics.drawRect(
      screen.x,
      screen.y,
      cellScreenSize,
      cellScreenSize,
    );
    this.anchorGraphics.endFill();
  }

  // ── Internals ───────────────────────────────────────────────────────

  private drawGrid(cam: CameraState, vp: ViewportSize): void {
    this.gridGraphics.clear();

    // Compute visible cell range (with one-cell buffer)
    const worldTL = Camera.screenToWorld({ x: 0, y: 0 }, cam, vp);
    const worldBR = Camera.screenToWorld({ x: vp.width, y: vp.height }, cam, vp);

    const minCx = Math.floor(Math.min(worldTL.x, worldBR.x) / CELL_SIZE) - 1;
    const maxCx = Math.ceil(Math.max(worldTL.x, worldBR.x) / CELL_SIZE) + 1;
    const minCy = Math.floor(Math.min(worldTL.y, worldBR.y) / CELL_SIZE) - 1;
    const maxCy = Math.ceil(Math.max(worldTL.y, worldBR.y) / CELL_SIZE) + 1;

    // Vertical lines
    for (let cx = minCx; cx <= maxCx; cx++) {
      const worldX = cx * CELL_SIZE;
      const screenX = vp.width / 2 + (worldX - cam.x) * cam.zoom;

      if (screenX < -CELL_SIZE * cam.zoom || screenX > vp.width + CELL_SIZE * cam.zoom) continue;

      const isMajor = cx % MAJOR_EVERY === 0;
      const color = isMajor ? COLOR_GRID_MAJOR : COLOR_GRID_LINE;
      const alpha = isMajor ? GRID_MAJOR_ALPHA : GRID_LINE_ALPHA;

      const screenTop = 0;
      const screenBot = vp.height;
      // We clip to viewport: draw only the portion visible
      this.gridGraphics.lineStyle(1, color, alpha);
      this.gridGraphics.moveTo(screenX, screenTop);
      this.gridGraphics.lineTo(screenX, screenBot);
    }

    // Horizontal lines
    for (let cy = minCy; cy <= maxCy; cy++) {
      const worldY = cy * CELL_SIZE;
      const screenY = vp.height / 2 + (worldY - cam.y) * cam.zoom;

      if (screenY < -CELL_SIZE * cam.zoom || screenY > vp.height + CELL_SIZE * cam.zoom) continue;

      const isMajor = cy % MAJOR_EVERY === 0;
      const color = isMajor ? COLOR_GRID_MAJOR : COLOR_GRID_LINE;
      const alpha = isMajor ? GRID_MAJOR_ALPHA : GRID_LINE_ALPHA;

      this.gridGraphics.lineStyle(1, color, alpha);
      this.gridGraphics.moveTo(0, screenY);
      this.gridGraphics.lineTo(vp.width, screenY);
    }
  }

  // ── Lifecycle ───────────────────────────────────────────────────────

  destroy(): void {
    this.gridGraphics.destroy();
    this.anchorGraphics.destroy();
    this.container.destroy({ children: true });
  }
}