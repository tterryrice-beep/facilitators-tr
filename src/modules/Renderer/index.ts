import { Container, Application, type IApplicationOptions } from "pixi.js";

export abstract class RenderStarter {
  protected readonly app: Application;
  protected readonly root = new Container();

  private destroyed = false;
  protected canvas: HTMLCanvasElement;

  constructor(
    protected readonly wrapper: HTMLElement,
    options?: Partial<IApplicationOptions>,
  ) {
    const canvas = document.createElement("canvas");
    this.canvas = canvas;
    this.wrapper.appendChild(canvas);

    this.app = new Application({
      width: wrapper.clientWidth,
      height: wrapper.clientHeight,
      background: "#000",
      view: canvas,
      ...options,
    });

    this.root.sortableChildren = true;

    this.app.stage.addChild(this.root);
    // this.wrapper.appendChild(this.app);
  }

  resize() {
    this.app.renderer.resize(
      this.wrapper.clientWidth,
      this.wrapper.clientHeight,
    );
  }

  destroy() {
    if (this.destroyed) return;
    try {
      this.destroyed = true;

      this.app.destroy(true, {
        children: true,
        texture: true,
      });

      this.wrapper?.removeChild(this.canvas);
      this.canvas?.remove();
    } catch (error) {
      console.error(error);
    }
  }
}
