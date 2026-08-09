import { Container, Graphics } from 'pixi.js';
import type { CardEntity } from './cardTypes';
import type { CameraState, ViewportSize } from './types';
import { CELL_SIZE } from './constants';

export interface ConnectionPreview {
  fromId: string;
  toId: string | null;
  color: string;
}

export class ConnectionRenderer {
  readonly container = new Container();
  private graphics = new Graphics();

  constructor() {
    this.container.addChild(this.graphics);
  }

  render(cards: CardEntity[], camera: CameraState, viewport: ViewportSize, preview?: ConnectionPreview): void {
    this.container.position.set(
      viewport.width / 2 - camera.x * camera.zoom,
      viewport.height / 2 - camera.y * camera.zoom,
    );
    this.container.scale.set(camera.zoom);
    this.graphics.clear();
    const byId = new Map(cards.map((card) => [card.id, card]));

    for (const from of cards) {
      const fromPoint = anchor(from);
      for (const connection of from.connects) {
        const to = byId.get(connection.id);
        if (!to || from.id > to.id) continue;
        const toPoint = anchor(to);
        this.drawLine(fromPoint.x, fromPoint.y, toPoint.x, toPoint.y, connection.color);
      }
    }

    if (preview) {
      const from = byId.get(preview.fromId);
      const to = preview.toId ? byId.get(preview.toId) : undefined;
      if (from && to) {
        const a = anchor(from); const b = anchor(to);
        this.drawLine(a.x, a.y, b.x, b.y, preview.color);
      }
    }
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number, color: string): void {
    this.graphics.lineStyle(3, parseColor(color), 1);
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
  }

  destroy(): void {
    this.graphics.destroy();
    this.container.destroy({ children: true });
  }
}

function anchor(card: CardEntity): { x: number; y: number } {
  return {
    x: (card.coordinates.x + card.width / 2) * CELL_SIZE,
    y: card.coordinates.y * CELL_SIZE,
  };
}

function parseColor(value: string): number {
  const normalized = value.replace('#', '');
  const parsed = Number.parseInt(normalized, 16);
  return Number.isFinite(parsed) ? parsed : 0xffffff;
}