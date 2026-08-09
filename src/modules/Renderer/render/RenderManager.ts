import type { CardId, ConnectionId, Card, Connection } from '../types';
import type { IRenderInvalidator } from '../core/RendererContext';
import type { BoardManager } from '../managers/BoardManager';
import type { ConnectionManager } from '../managers/ConnectionManager';
import type { SelectionManager } from '../managers/SelectionManager';
import type { CameraManager } from '../camera/CameraManager';
import type { ViewportManager } from '../viewport/ViewportManager';
import type { SpatialIndex } from '../spatial';
import { RenderLayers } from './RenderLayers';
import { createCardView, type CardView } from './views/CardView';
import { createConnectionView, type ConnectionView } from './views/ConnectionView';
import { createGridView, type GridView } from './views/GridView';
import { createSelectionBoxView, type SelectionBoxView } from './views/SelectionBoxView';
import { createResizeHandlesView, type ResizeHandlesView } from './views/ResizeHandlesView';

export class RenderManager implements IRenderInvalidator {
  private layers: RenderLayers;
  private cardViews = new Map<CardId, CardView>();
  private connectionViews = new Map<ConnectionId, ConnectionView>();
  private gridView: GridView;
  private selectionBox: SelectionBoxView;
  private resizeHandles: ResizeHandlesView;
  private gridDirty = true;

  constructor(
    private boardManager: BoardManager,
    private connectionManager: ConnectionManager,
    private selectionManager: SelectionManager,
    private cameraManager: CameraManager,
    private viewportManager: ViewportManager,
    private spatialIndex: SpatialIndex<CardId>,
  ) {
    this.layers = new RenderLayers();
    this.gridView = createGridView();
    this.layers.gridLayer.addChild(this.gridView.container);
    this.selectionBox = createSelectionBoxView();
    this.layers.overlayLayer.addChild(this.selectionBox.container);
    this.resizeHandles = createResizeHandlesView();
    this.layers.overlayLayer.addChild(this.resizeHandles.container);
    this.cameraManager.setWorldContainer(this.layers.getWorldContainer());
  }

  getRoot() { return this.layers.root; }
  getScreenOverlay() { return this.layers.getScreenOverlay(); }

  markDirtyCards(cardIds: CardId[]): void {
    for (const id of cardIds) { const v = this.cardViews.get(id); if (v) v.dirty = true; }
  }
  markDirtyConnections(connectionIds: ConnectionId[]): void {
    for (const id of connectionIds) { const v = this.connectionViews.get(id); if (v) v.dirty = true; }
  }
  markAllDirty(): void {
    for (const [, v] of this.cardViews) v.dirty = true;
    for (const [, v] of this.connectionViews) v.dirty = true;
    this.gridDirty = true;
  }
// ── Per-frame update ──────────────────────────────────────────────
  update(): void {
    const camera = this.cameraManager.camera;
    if (camera.isDirty()) {
      this.cameraManager.applyTransform();
      camera.clearDirty();
      this.viewportManager.markDirty();
      this.gridDirty = true;
    }
    if (this.viewportManager.isDirty()) {
      this.viewportManager.recompute();
    }
    const settings = this.boardManager.getSettings();
    if (settings.grid.enabled && this.gridDirty) {
      const s = settings.grid;
      this.gridView.updateGrid(camera.x, camera.y, camera.zoom,
        window.innerWidth, window.innerHeight,
        s.size, s.majorEvery, s.color, s.majorColor);
      this.gridDirty = false;
    }
    if (settings.rendering.cullingEnabled) {
      this.updateCulling();
    }
    this.updateDirtyCards();
    this.updateDirtyConnections();
    this.updateSelectionVisuals();
  }

  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  private updateCulling(): void {
    const paddedRect = this.viewportManager.getPaddedWorldRect();
    const visibleCardIds = this.spatialIndex.queryRect(paddedRect);
    const visibleSet = new Set(visibleCardIds);

    for (const cardId of visibleCardIds) {
      const card = this.boardManager.getCard(cardId as CardId);
      if (!card) continue;
      let view = this.cardViews.get(cardId as CardId);
      if (!view) {
        view = this.createViewForCard(card);
        this.cardViews.set(cardId as CardId, view);
      }
      if (view.container.parent !== this.layers.cardLayer) {
        this.layers.cardLayer.addChild(view.container);
      }
      view.visible = true; view.dirty = true;
    }
    for (const [cardId, view] of this.cardViews) {
      if (!visibleSet.has(cardId)) {
        if (view.container.parent) view.container.parent.removeChild(view.container);
        view.visible = false;
      }
    }

    const visibleConnIds = new Set<ConnectionId>();
    const allConns = this.boardManager.getConnections();
    for (const [connId, conn] of Object.entries(allConns)) {
      if (visibleSet.has(conn.fromCardId) || visibleSet.has(conn.toCardId)) {
        visibleConnIds.add(connId as ConnectionId);
      }
    }
    for (const connId of visibleConnIds) {
      let view = this.connectionViews.get(connId);
      if (!view) {
        view = createConnectionView(connId);
        this.connectionViews.set(connId, view);
        this.layers.connectionLayer.addChild(view.container);
      }
      view.visible = true; view.dirty = true;
    }
    for (const [connId, view] of this.connectionViews) {
      if (!visibleConnIds.has(connId)) {
        if (view.container.parent) view.container.parent.removeChild(view.container);
        view.visible = false;
      }
    }
  }

  private createViewForCard(card: Card): CardView {
    const view = createCardView(card.id, card.size.width, card.size.height,
      card.color ?? '#2d3748', card.title, card.text);
    view.setPosition(card.position.x, card.position.y);
    view.setZIndex(card.zIndex);
    return view;
  }

  private updateDirtyCards(): void {
    const dirtyIds = this.boardManager.getAndClearDirtyCards();
    for (const cardId of dirtyIds) {
      const card = this.boardManager.getCard(cardId);
      const view = this.cardViews.get(cardId);
      if (!card || !view) continue;
      view.setPosition(card.position.x, card.position.y);
      view.setSize(card.size.width, card.size.height);
      view.setTitle(card.title);
      view.setText(card.text);
      if (card.color) view.setColor(card.color);
      view.setZIndex(card.zIndex);
      view.setSelected(this.selectionManager.isSelected(cardId));
      view.dirty = false;
      this.spatialIndex.update(cardId, {
        minX: card.position.x, minY: card.position.y,
        maxX: card.position.x + card.size.width,
        maxY: card.position.y + card.size.height,
      });
    }
  }

  private updateDirtyConnections(): void {
    const dirtyIds = this.boardManager.getAndClearDirtyConnections();
    for (const connId of dirtyIds) {
      const conn = this.boardManager.getConnection(connId);
      const view = this.connectionViews.get(connId);
      if (!conn || !view) continue;
      const fromPt = this.connectionManager.getAnchorWorldPoint(conn.fromCardId, 'center');
      const toPt = this.connectionManager.getAnchorWorldPoint(conn.toCardId, 'center');
      if (fromPt && toPt) {
        view.updateLine(fromPt.x, fromPt.y, toPt.x, toPt.y, conn.style.color, conn.style.width);
      }
      view.dirty = false;
    }
  }

  private updateSelectionVisuals(): void {
    const sel = this.selectionManager.getSelection();
    if (sel.selectionRect) {
      this.selectionBox.updateRect(sel.selectionRect);
    } else {
      this.selectionBox.hide();
    }
    for (const [, view] of this.cardViews) {
      if (view.visible) view.setSelected(this.selectionManager.isSelected(view.cardId as CardId));
    }
    if (sel.primaryCardId) {
      const card = this.boardManager.getCard(sel.primaryCardId);
      if (card) {
        this.resizeHandles.updateForRect(card.position.x, card.position.y, card.size.width, card.size.height);
      } else {
        this.resizeHandles.hide();
      }
    } else {
      this.resizeHandles.hide();
    }
  }

  destroy(): void {
    for (const [, v] of this.cardViews) v.destroy();
    for (const [, v] of this.connectionViews) v.destroy();
    this.gridView.destroy();
    this.selectionBox.destroy();
    this.resizeHandles.destroy();
    this.layers.destroy();
    this.cardViews.clear();
    this.connectionViews.clear();
  }
}