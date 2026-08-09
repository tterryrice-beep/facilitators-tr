import { Container, Graphics } from 'pixi.js';

export interface ConnectionView {
  container: Container;
  connectionId: string;
  visible: boolean;
  dirty: boolean;
  destroy(): void;
  updateLine(x1: number, y1: number, x2: number, y2: number, color: string, width: number): void;
}

export function createConnectionView(connectionId: string): ConnectionView {
  const container = new Container();
  const graphics = new Graphics();
  container.addChild(graphics);

  let _color = '#ffffff';
  let _width = 2;

  const view: ConnectionView = {
    container,
    connectionId,
    visible: true,
    dirty: true,
    destroy() { container.destroy({ children: true }); },
    updateLine(x1, y1, x2, y2, color, width) {
      _color = color;
      _width = width;
      graphics.clear();
      graphics.lineStyle(width, parseColor(color), 0.8);
      graphics.moveTo(x1, y1);
      graphics.lineTo(x2, y2);
    },
  };

  return view;
}

function parseColor(color: string): number {
  if (color.startsWith('#')) return parseInt(color.slice(1), 16);
  return 0xffffff;
}