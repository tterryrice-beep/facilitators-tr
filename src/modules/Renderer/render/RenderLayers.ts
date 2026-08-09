import { Container } from 'pixi.js';
import { Z_INDEX } from './zIndex';

export class RenderLayers {
  readonly root: Container;
  readonly worldLayer: Container;
  readonly gridLayer: Container;
  readonly connectionLayer: Container;
  readonly cardLayer: Container;
  readonly overlayLayer: Container;
  readonly screenOverlayLayer: Container;

  constructor() {
    this.root = new Container();
    this.worldLayer = new Container();
    this.gridLayer = new Container();
    this.connectionLayer = new Container();
    this.cardLayer = new Container();
    this.overlayLayer = new Container();
    this.screenOverlayLayer = new Container();

    this.cardLayer.sortableChildren = true;

    this.worldLayer.addChild(this.gridLayer);
    this.worldLayer.addChild(this.connectionLayer);
    this.worldLayer.addChild(this.cardLayer);
    this.worldLayer.addChild(this.overlayLayer);

    this.root.addChild(this.worldLayer);
    this.root.addChild(this.screenOverlayLayer);

    this.gridLayer.zIndex = Z_INDEX.GRID;
    this.connectionLayer.zIndex = Z_INDEX.CONNECTION;
  }

  getWorldContainer(): Container {
    return this.worldLayer;
  }

  getScreenOverlay(): Container {
    return this.screenOverlayLayer;
  }

  destroy(): void {
    this.root.destroy({ children: true });
  }
}