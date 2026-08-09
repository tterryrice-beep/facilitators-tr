import type { Point, CameraState, Rect } from '../types';
import { Camera } from './Camera';
import type { Container } from 'pixi.js';

export class CameraManager {
  readonly camera: Camera;
  private worldContainer: Container | null = null;

  constructor(initialState?: Partial<CameraState>) {
    this.camera = new Camera(initialState);
  }

  setWorldContainer(container: Container): void {
    this.worldContainer = container;
  }

  applyTransform(): void {
    if (!this.worldContainer) return;
    this.worldContainer.position.set(this.camera.x, this.camera.y);
    this.worldContainer.scale.set(this.camera.zoom);
  }

  screenToWorld(screen: Point): Point {
    return this.camera.screenToWorld(screen);
  }

  worldToScreen(world: Point): Point {
    return this.camera.worldToScreen(world);
  }

  panBy(screenDelta: Point): void {
    this.camera.panBy(screenDelta);
  }

  zoomAt(screenPoint: Point, zoomDelta: number): void {
    this.camera.zoomAt(screenPoint, zoomDelta);
  }

  fitBounds(bounds: Rect, screenWidth: number, screenHeight: number, padding = 100): void {
    const bw = bounds.width + padding * 2;
    const bh = bounds.height + padding * 2;
    const zoomX = screenWidth / bw;
    const zoomY = screenHeight / bh;
    const zoom = Math.min(zoomX, zoomY);

    this.camera.setZoom(Math.max(this.camera.minZoom, Math.min(this.camera.maxZoom, zoom)));

    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    this.camera.setPosition(
      screenWidth / 2 - centerX * this.camera.zoom,
      screenHeight / 2 - centerY * this.camera.zoom,
    );
  }

  getState(): CameraState {
    return this.camera.getState();
  }

  updateState(state: CameraState): void {
    this.camera.x = state.x;
    this.camera.y = state.y;
    this.camera.zoom = state.zoom;
    this.camera.markDirty();
  }
}