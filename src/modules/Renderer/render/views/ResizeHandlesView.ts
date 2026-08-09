import { Container, Graphics } from 'pixi.js';

const HANDLE_SIZE = 8;

export interface ResizeHandlesView {
  container: Container;
  visible: boolean;
  updateForRect(x: number, y: number, w: number, h: number): void;
  hide(): void;
  destroy(): void;
  hitTest(px: number, py: number): 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null;
}

export function createResizeHandlesView(): ResizeHandlesView {
  const container = new Container();
  container.visible = false;
  const graphics = new Graphics();
  container.addChild(graphics);

  return {
    container,
    visible: false,
    updateForRect(x, y, w, h) {
      container.visible = true;
      graphics.clear();
      const handles = [
        { cx: x, cy: y }, { cx: x + w / 2, cy: y }, { cx: x + w, cy: y },
        { cx: x, cy: y + h / 2 }, { cx: x + w, cy: y + h / 2 },
        { cx: x, cy: y + h }, { cx: x + w / 2, cy: y + h }, { cx: x + w, cy: y + h },
      ];
      for (const { cx, cy } of handles) {
        graphics.beginFill(0x4a9eff, 1);
        graphics.drawRect(cx - HANDLE_SIZE / 2, cy - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE);
        graphics.endFill();
      }
    },
    hide() { container.visible = false; graphics.clear(); },
    destroy() { container.destroy({ children: true }); },
    hitTest(px: number, py: number): string | null {
      // Simplified hit test
      return null;
    },
  };
}