import type { Point, CameraState } from '../types';
import { DEFAULT_CAMERA_STATE } from '../core/constants';

export class Camera {
  x: number;
  y: number;
  zoom: number;
  minZoom: number;
  maxZoom: number;

  private dirty = true;

  constructor(state: Partial<CameraState> = {}) {
    const defaults = DEFAULT_CAMERA_STATE;
    this.x = state.x ?? defaults.x;
    this.y = state.y ?? defaults.y;
    this.zoom = state.zoom ?? defaults.zoom;
    this.minZoom = state.minZoom ?? defaults.minZoom;
    this.maxZoom = state.maxZoom ?? defaults.maxZoom;
  }

  getState(): CameraState {
    return {
      x: this.x,
      y: this.y,
      zoom: this.zoom,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
    };
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

  screenToWorld(screenPoint: Point): Point {
    return {
      x: (screenPoint.x - this.x) / this.zoom,
      y: (screenPoint.y - this.y) / this.zoom,
    };
  }

  worldToScreen(worldPoint: Point): Point {
    return {
      x: worldPoint.x * this.zoom + this.x,
      y: worldPoint.y * this.zoom + this.y,
    };
  }

  panBy(screenDelta: Point): void {
    this.x += screenDelta.x;
    this.y += screenDelta.y;
    this.markDirty();
  }

  zoomAt(screenPoint: Point, zoomDelta: number): void {
    const worldBefore = this.screenToWorld(screenPoint);
    const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * zoomDelta));
    this.zoom = newZoom;
    const screenAfter = this.worldToScreen(worldBefore);
    this.x += screenPoint.x - screenAfter.x;
    this.y += screenPoint.y - screenAfter.y;
    this.markDirty();
  }

  setZoom(zoom: number): void {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
    this.markDirty();
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.markDirty();
  }
}