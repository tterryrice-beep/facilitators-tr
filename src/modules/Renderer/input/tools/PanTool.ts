import { BaseTool } from './BaseTool';
import type { InputState } from '../InputState';
import type { CameraManager } from '../../camera/CameraManager';
import type { ViewportManager } from '../../viewport/ViewportManager';

export class PanTool extends BaseTool {
  name = 'pan';
  private isPanning = false;
  private lastPoint: { x: number; y: number } | null = null;

  constructor(
    private cameraManager: CameraManager,
    private viewportManager: ViewportManager,
  ) { super(); }

  onPointerDown(state: InputState): void {
    this.isPanning = true;
    this.lastPoint = { ...state.screenPosition };
  }

  onPointerMove(state: InputState): void {
    if (!this.isPanning || !this.lastPoint) return;
    const dx = state.screenPosition.x - this.lastPoint.x;
    const dy = state.screenPosition.y - this.lastPoint.y;
    this.cameraManager.panBy({ x: dx, y: dy });
    this.lastPoint = { ...state.screenPosition };
  }

  onPointerUp(_state: InputState): void {
    this.isPanning = false;
    this.lastPoint = null;
  }

  onWheel(state: InputState, deltaY: number): void {
    const zoomDelta = deltaY > 0 ? 0.9 : 1.1;
    this.cameraManager.zoomAt(state.screenPosition, zoomDelta);
  }

  onKeyDown(_key: string, _state: InputState): void {}
  onKeyUp(_key: string, _state: InputState): void {}

  deactivate(): void {
    this.isPanning = false;
    this.lastPoint = null;
  }
}