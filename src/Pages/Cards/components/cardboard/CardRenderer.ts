import { Container, Graphics, Text } from 'pixi.js';
import type { CardEntity } from './cardTypes';
import type { CameraState, ViewportSize } from './types';
import { Camera } from './Camera';
import { CELL_SIZE } from './constants';

export class CardRenderer {
  readonly container = new Container();
  private cardViews = new Map<string, Container>();
  private preview: Graphics | null = null;

  render(
    cards: CardEntity[],
    camera: CameraState,
    viewport: ViewportSize,
    previewPlacement?: { card: CardEntity; coordinates: { x: number; y: number }; available: boolean },
    connectMode?: { sourceId: string; hoveredId: string | null },
  ): void {
    // Card views live in world coordinates. Apply the camera transform once
    // to the layer so cards move and scale together with the board.
    this.container.position.set(
      viewport.width / 2 - camera.x * camera.zoom,
      viewport.height / 2 - camera.y * camera.zoom,
    );
    this.container.scale.set(camera.zoom);

    const visibleIds = new Set<string>();
    const worldLeft = Camera.screenToWorld({ x: 0, y: 0 }, camera, viewport);
    const worldRight = Camera.screenToWorld({ x: viewport.width, y: viewport.height }, camera, viewport);
    const minX = Math.min(worldLeft.x, worldRight.x);
    const maxX = Math.max(worldLeft.x, worldRight.x);
    const minY = Math.min(worldLeft.y, worldRight.y);
    const maxY = Math.max(worldLeft.y, worldRight.y);

    for (const card of cards) {
      const x = card.coordinates.x * CELL_SIZE;
      const y = card.coordinates.y * CELL_SIZE;
      const width = card.width * CELL_SIZE;
      const height = card.height * CELL_SIZE;
      if (x + width < minX || x > maxX || y + height < minY || y > maxY) continue;

      visibleIds.add(card.id);
      let view = this.cardViews.get(card.id);
      if (!view) {
        view = this.createView(card);
        this.cardViews.set(card.id, view);
        this.container.addChild(view);
      }
      view.position.set(x, y);
      view.visible = true;
      view.alpha = connectMode && card.id !== connectMode.sourceId && card.id !== connectMode.hoveredId ? 0.75 : 1;
      const mask = view.mask as Graphics | null;
      if (mask) {
        mask.clear();
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, width, height);
        mask.endFill();
      } else {
        const cardMask = new Graphics();
        cardMask.beginFill(0xffffff);
        cardMask.drawRect(0, 0, width, height);
        cardMask.endFill();
        view.addChild(cardMask);
        view.mask = cardMask;
      }
      const background = view.getChildAt(0) as Graphics;
      background.clear();
      background.beginFill(0x2d5a87, 0.96);
      background.lineStyle(1, 0x75bfff, 0.8);
      background.drawRoundedRect(0, 0, width, height, Math.min(8, CELL_SIZE / 4));
      background.endFill();
      const title = view.getChildAt(1) as Text;
      title.text = card.title || 'Untitled card';
      title.style.wordWrapWidth = Math.max(20, width - 16);
      const body = view.getChildAt(2) as Text;
      body.text = card.text;
      body.style.wordWrapWidth = Math.max(20, width - 16);
    }

    for (const [id, view] of this.cardViews) {
      if (!visibleIds.has(id)) view.visible = false;
    }

    this.renderPreview(previewPlacement, camera, viewport);
  }

  private createView(card: CardEntity): Container {
    const view = new Container();
    view.eventMode = 'none';
    const background = new Graphics();
    const title = new Text(card.title || 'Untitled card', {
      fontFamily: 'Arial', fontSize: 14, fill: 0xffffff, fontWeight: 'bold', wordWrap: true,
    });
    title.position.set(8, 8);
    const body = new Text(card.text, {
      fontFamily: 'Arial', fontSize: 12, fill: 0xdbeafe, wordWrap: true,
    });
    body.position.set(8, 30);
    view.addChild(background, title, body);
    return view;
  }

  private renderPreview(
    placement: { card: CardEntity; coordinates: { x: number; y: number }; available: boolean } | undefined,
    camera: CameraState,
    viewport: ViewportSize,
  ): void {
    if (!placement) {
      this.preview?.clear();
      return;
    }
    if (!this.preview) {
      this.preview = new Graphics();
      this.container.addChild(this.preview);
    }
    // The preview is a child of the world-space card layer, so it must also
    // be drawn in world coordinates. The layer's camera transform scales it.
    const x = placement.coordinates.x * CELL_SIZE;
    const y = placement.coordinates.y * CELL_SIZE;
    const width = placement.card.width * CELL_SIZE;
    const height = placement.card.height * CELL_SIZE;
    this.preview.clear();
    this.preview.beginFill(placement.available ? 0x39c16c : 0xe05252, 0.22);
    this.preview.lineStyle(2, placement.available ? 0x57e389 : 0xff6b6b, 0.95);
    this.preview.drawRect(x, y, width, height);
    this.preview.endFill();
  }

  destroy(): void {
    this.preview?.destroy();
    for (const view of this.cardViews.values()) view.destroy({ children: true });
    this.cardViews.clear();
    this.container.destroy({ children: true });
  }
}