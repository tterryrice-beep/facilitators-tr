import { Container, Application, type IApplicationOptions } from 'pixi.js';

/**
 * Low-level PixiJS bootstrap.
 * Handles canvas creation, app lifecycle, resize.
 */
export class RenderStarter {
  readonly app: Application;
  readonly root = new Container();

  private destroyed = false;
  readonly canvas: HTMLCanvasElement;

  constructor(
    readonly wrapper: HTMLElement,
    options?: Partial<IApplicationOptions>,
  ) {
    const canvas = document.createElement('canvas');
    this.canvas = canvas;
    this.wrapper.appendChild(canvas);

    this.app = new Application({
      width: wrapper.clientWidth,
      height: wrapper.clientHeight,
      background: '#1a1a2e',
      view: canvas,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
      ...options,
    });

    this.root.sortableChildren = true;
    this.app.stage.addChild(this.root);
  }

  resize(): void {
    if (this.destroyed) return;
    this.app.renderer.resize(
      this.wrapper.clientWidth,
      this.wrapper.clientHeight,
    );
  }

  destroy(): void {
    if (this.destroyed) return;
    try {
      this.destroyed = true;
      this.app.destroy(true, { children: true, texture: true });
      if (this.wrapper.contains(this.canvas)) {
        this.wrapper.removeChild(this.canvas);
      }
      this.canvas.remove();
    } catch (error) {
      console.error(error);
    }
  }

  getContainer(): Container {
    return this.root;
  }
}