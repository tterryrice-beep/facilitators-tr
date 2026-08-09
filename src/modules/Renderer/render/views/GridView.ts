import { Container, Graphics } from 'pixi.js';

export interface GridView {
  container: Container;
  updateGrid(
    cameraX: number, cameraY: number, zoom: number,
    screenWidth: number, screenHeight: number,
    gridSize: number, majorEvery: number,
    color: string, majorColor: string,
  ): void;
  destroy(): void;
}

export function createGridView(): GridView {
  const container = new Container();
  const graphics = new Graphics();
  container.addChild(graphics);

  return {
    container,
    updateGrid(cx, cy, zoom, sw, sh, gridSize, majorEvery, color, majorColor) {
      graphics.clear();

      const worldTL = { x: -cx / zoom, y: -cy / zoom };
      const worldBR = { x: (-cx + sw) / zoom, y: (-cy + sh) / zoom };

      const startX = Math.floor(worldTL.x / gridSize) * gridSize;
      const startY = Math.floor(worldTL.y / gridSize) * gridSize;

      const minorColorNum = parseColor(color);
      const majorColorNum = parseColor(majorColor);

      for (let x = startX; x <= worldBR.x; x += gridSize) {
        const isMajor = (Math.round(x / gridSize) % majorEvery === 0);
        graphics.lineStyle(isMajor ? 1.5 : 0.5, isMajor ? majorColorNum : minorColorNum, isMajor ? 0.3 : 0.15);
        graphics.moveTo(x, worldTL.y);
        graphics.lineTo(x, worldBR.y);
      }
      for (let y = startY; y <= worldBR.y; y += gridSize) {
        const isMajor = (Math.round(y / gridSize) % majorEvery === 0);
        graphics.lineStyle(isMajor ? 1.5 : 0.5, isMajor ? majorColorNum : minorColorNum, isMajor ? 0.3 : 0.15);
        graphics.moveTo(worldTL.x, y);
        graphics.lineTo(worldBR.x, y);
      }
    },
    destroy() { container.destroy({ children: true }); },
  };
}

function parseColor(color: string): number {
  if (color.startsWith('#')) return parseInt(color.slice(1), 16);
  if (color.startsWith('rgba')) {
    const m = color.match(/[\d.]+/g);
    if (m && m.length >= 3) {
      return (parseInt(m[0]) << 16) | (parseInt(m[1]) << 8) | parseInt(m[2]);
    }
  }
  return 0x555555;
}