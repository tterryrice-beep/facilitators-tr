import type { Rect, Point } from '../types';
import type { Camera } from '../camera/Camera';
import { VIEWPORT_CULLING_PADDING } from '../core/constants';

export class ViewportManager {
  private width = 0;
  private height = 0;
  private visibleWorldRect: Rect = { x: 0, y: 0, width: 0, height: 0 };
  private paddedWorldRect: Rect = { x: 0, y: 0, width: 0, height: 0 };
  private dirty = true;

  constructor(private camera: Camera) {}

  setSize(w: number, h: number): void {
    if (this.width !== w || this.height !== h) {
      this.width = w;
      this.height = h;
      this.markDirty();
    }
  }

  getSize(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  isDirty(): boolean {
    return this.dirty;
  }

  clearDirty(): void {
    this.dirty = false;
  }

  markDirty(): void {
    this.dirty = true;
  }

  recompute(): void {
    const TL = this.camera.screenToWorld({ x: 0, y: 0 });
    const BR = this.camera.screenToWorld({ x: this.width, y: this.height });

    this.visibleWorldRect = {
      x: TL.x,
      y: TL.y,
      width: BR.x - TL.x,
      height: BR.y - TL.y,
    };

    const padding = VIEWPORT_CULLING_PADDING / this.camera.zoom;
    this.paddedWorldRect = {
      x: TL.x - padding,
      y: TL.y - padding,
      width: (BR.x - TL.x) + padding * 2,
      height: (BR.y - TL.y) + padding * 2,
    };

    this.clearDirty();
  }

  getVisibleWorldRect(): Rect {
    if (this.dirty) this.recompute();
    return this.visibleWorldRect;
  }

  getPaddedWorldRect(): Rect {
    if (this.dirty) this.recompute();
    return this.paddedWorldRect;
  }

  getWorldPoint(screen: Point): Point {
    return this.camera.screenToWorld(screen);
  }
}