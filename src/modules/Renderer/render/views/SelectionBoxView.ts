import { Graphics, Container } from 'pixi.js';
import type { Rect } from '../../types';

export interface SelectionBoxView {
  container: Container;
  visible: boolean;
  updateRect(rect: Rect): void;
  hide(): void;
  destroy(): void;
}

export function createSelectionBoxView(): SelectionBoxView {
  const container = new Container();
  container.visible = false;
  const graphics = new Graphics();
  container.addChild(graphics);

  return {
    container,
    visible: false,
    updateRect(rect: Rect) {
      container.visible = true;
      graphics.clear();
      graphics.lineStyle(1, 0x4a9eff, 0.8);
      graphics.beginFill(0x4a9eff, 0.1);
      graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
      graphics.endFill();
    },
    hide() {
      container.visible = false;
      graphics.clear();
    },
    destroy() { container.destroy({ children: true }); },
  };
}