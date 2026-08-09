import { BaseTool } from './BaseTool';
import type { InputState } from '../InputState';
import type { CameraManager } from '../../camera/CameraManager';
import type { ViewportManager } from '../../viewport/ViewportManager';
import type { SelectionManager } from '../../managers/SelectionManager';
import type { CardManager } from '../../managers/CardManager';
import type { ConnectionManager } from '../../managers/ConnectionManager';
import type { HistoryManager } from '../../managers/HistoryManager';
import type { BoardManager } from '../../managers/BoardManager';
import type { SpatialIndex } from '../../spatial';
import type { CardId } from '../../types';
import { MoveCardsCommand } from '../../commands/MoveCardsCommand';

type DragMode = 'none' | 'pan' | 'cards';

export class SelectTool extends BaseTool {
  name = 'select';
  private mode: DragMode = 'none';
  private dragCardIds: CardId[] = [];
  private dragStartPositions: { id: CardId; x: number; y: number }[] = [];
  private dragStartWorld: { x: number; y: number } | null = null;
  private dragStartCamera: { x: number; y: number } | null = null;
  private isDragging = false;

  constructor(
    private cameraManager: CameraManager,
    private viewportManager: ViewportManager,
    private selectionManager: SelectionManager,
    private cardManager: CardManager,
    private connectionManager: ConnectionManager,
    private historyManager: HistoryManager,
    private boardManager: BoardManager,
    private spatialIndex: SpatialIndex<CardId>,
    public onDoubleClick?: (cardId: CardId) => void,
  ) { super(); }

  onPointerDown(state: InputState): void {
    const world = state.worldPosition;
    this.isDragging = false;
    this.dragCardIds = [];
    this.dragStartPositions = [];
    const candidates = this.spatialIndex.queryPoint(world);
    const hitCardId: CardId | null = (candidates.length > 0 ? candidates[candidates.length - 1] : null) as CardId | null;

    if (hitCardId) {
      const toggle = state.modifierKeys.shift || state.modifierKeys.ctrl;
      this.selectionManager.selectCard(hitCardId, toggle);
      this.mode = 'cards';
      const selectedIds = this.selectionManager.getSelectedCardIds();
      this.dragCardIds = selectedIds;
      this.dragStartWorld = { x: world.x, y: world.y };
      for (const id of selectedIds) {
        const card = this.boardManager.getCard(id);
        if (card) this.dragStartPositions.push({ id, x: card.position.x, y: card.position.y });
      }
    } else {
      this.selectionManager.clearSelection();
      this.mode = 'pan';
      this.dragStartCamera = { x: this.cameraManager.camera.x, y: this.cameraManager.camera.y };
      this.dragStartWorld = { x: world.x, y: world.y };
    }
  }

  onPointerMove(state: InputState): void {
    const world = state.worldPosition;
    if (this.mode === 'pan' && this.dragStartCamera && this.dragStartWorld) {
      const dx = world.x - this.dragStartWorld.x;
      const dy = world.y - this.dragStartWorld.y;
      if (!this.isDragging) { if (Math.abs(dx) > 3 || Math.abs(dy) > 3) this.isDragging = true; }
      if (this.isDragging) {
        this.cameraManager.camera.setPosition(
          this.dragStartCamera.x + dx * this.cameraManager.camera.zoom,
          this.dragStartCamera.y + dy * this.cameraManager.camera.zoom);
        this.cameraManager.camera.markDirty();
      }
      return;
    }
    if (this.mode === 'cards' && this.dragCardIds.length > 0 && this.dragStartWorld) {
      const dx = world.x - this.dragStartWorld.x;
      const dy = world.y - this.dragStartWorld.y;
      if (!this.isDragging) { if (Math.abs(dx) > 3 || Math.abs(dy) > 3) this.isDragging = true; }
      if (this.isDragging) {
        for (const entry of this.dragStartPositions) {
          const card = this.boardManager.getCard(entry.id);
          if (card) {
            const np = { x: entry.x + dx, y: entry.y + dy };
            card.position = np;
            this.cardManager.updateSpatial(entry.id, np, card.size);
            this.boardManager.markCardsDirty([entry.id]);
          }
        }
        for (const id of this.dragCardIds) {
          this.boardManager.markConnectionsDirty(this.boardManager.getConnectionIdsForCard(id));
        }
      }
    }
  }

  onPointerUp(state: InputState): void {
    const world = state.worldPosition;
    if (this.mode === 'pan') { this.reset(); return; }
    if (this.mode === 'cards' && this.isDragging && this.dragCardIds.length > 0 && this.dragStartWorld) {
      const dx = world.x - this.dragStartWorld.x;
      const dy = world.y - this.dragStartWorld.y;
      for (const entry of this.dragStartPositions) {
        const card = this.boardManager.getCard(entry.id);
        if (card) card.position = { x: entry.x, y: entry.y };
      }
      const entries = this.dragStartPositions.map(e => ({
        cardId: e.id, from: { x: e.x, y: e.y }, to: { x: e.x + dx, y: e.y + dy },
      }));
      this.historyManager.executeCommand(new MoveCardsCommand(entries));
      for (const id of this.dragCardIds) {
        this.boardManager.markConnectionsDirty(this.boardManager.getConnectionIdsForCard(id));
      }
    }
    this.reset();
  }

  onWheel(state: InputState, deltaY: number): void {
    this.cameraManager.zoomAt(state.screenPosition, deltaY > 0 ? 0.9 : 1.1);
  }

  onKeyDown(key: string, _state: InputState): void {
    const cam = this.cameraManager.camera;
    const s = 50 / cam.zoom;
    if (key === 'ArrowUp') { cam.y += s; cam.markDirty(); }
    else if (key === 'ArrowDown') { cam.y -= s; cam.markDirty(); }
    else if (key === 'ArrowLeft') { cam.x += s; cam.markDirty(); }
    else if (key === 'ArrowRight') { cam.x -= s; cam.markDirty(); }
  }

  onKeyUp(_key: string, _state: InputState): void {}

  private reset(): void {
    this.mode = 'none'; this.isDragging = false;
    this.dragCardIds = []; this.dragStartPositions = [];
    this.dragStartWorld = null; this.dragStartCamera = null;
  }

  deactivate(): void { this.reset(); }
}
