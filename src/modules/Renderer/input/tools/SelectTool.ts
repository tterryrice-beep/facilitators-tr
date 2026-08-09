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
import type { CardId, Rect } from '../../types';
import { MoveCardsCommand } from '../../commands/MoveCardsCommand';

export class SelectTool extends BaseTool {
  name = 'select';
  private dragging = false;
  private dragCardIds: CardId[] = [];
  private dragStartPositions: { id: CardId; x: number; y: number }[] = [];
  private dragStartWorld: { x: number; y: number } | null = null;
  private selectingRect = false;
  private selStart: { x: number; y: number } | null = null;

  constructor(
    private cameraManager: CameraManager,
    private viewportManager: ViewportManager,
    private selectionManager: SelectionManager,
    private cardManager: CardManager,
    private connectionManager: ConnectionManager,
    private historyManager: HistoryManager,
    private boardManager: BoardManager,
    private spatialIndex: SpatialIndex<CardId>,
  ) { super(); }

  onPointerDown(state: InputState): void {
    const world = state.worldPosition;
    this.dragging = false;
    this.dragCardIds = [];
    this.dragStartPositions = [];

    const candidates = this.spatialIndex.queryPoint(world);
    let hitCardId: CardId | null = (candidates.length > 0 ? candidates[candidates.length - 1] : null) as CardId | null;

    if (hitCardId) {
      const toggle = state.modifierKeys.shift || state.modifierKeys.ctrl;
      this.selectionManager.selectCard(hitCardId, toggle);

      const selectedIds = this.selectionManager.getSelectedCardIds();
      this.dragCardIds = selectedIds;
      this.dragStartWorld = { x: world.x, y: world.y };
      for (const id of selectedIds) {
        const card = this.boardManager.getCard(id);
        if (card) {
          this.dragStartPositions.push({ id, x: card.position.x, y: card.position.y });
        }
      }
    } else {
      this.selectionManager.clearSelection();
      this.selectingRect = true;
      this.selStart = { x: world.x, y: world.y };
      this.dragStartWorld = { x: world.x, y: world.y };
    }
  }

  onPointerMove(state: InputState): void {
    const world = state.worldPosition;

    if (this.selectingRect && this.selStart) {
      const rect: Rect = {
        x: Math.min(this.selStart.x, world.x),
        y: Math.min(this.selStart.y, world.y),
        width: Math.abs(world.x - this.selStart.x),
        height: Math.abs(world.y - this.selStart.y),
      };
      this.selectionManager.selectByRectangle(rect);
      return;
    }

    if (this.dragCardIds.length > 0 && this.dragStartWorld) {
      const dx = world.x - this.dragStartWorld.x;
      const dy = world.y - this.dragStartWorld.y;

      if (!this.dragging) {
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) this.dragging = true;
      }

      if (this.dragging) {
        // Live preview: directly update card positions on the board
        for (const entry of this.dragStartPositions) {
          const card = this.boardManager.getCard(entry.id);
          if (card) {
            const newPos = { x: entry.x + dx, y: entry.y + dy };
            card.position = newPos;
            this.cardManager.updateSpatial(entry.id, newPos, card.size);
            this.boardManager.markCardsDirty([entry.id]);
          }
        }
        // Mark affected connections dirty
        for (const id of this.dragCardIds) {
          this.boardManager.markConnectionsDirty(
            this.boardManager.getConnectionIdsForCard(id),
          );
        }
      }
    }
  }

  onPointerUp(state: InputState): void {
    if (this.selectingRect) {
      this.selectingRect = false;
      this.selStart = null;
      this.dragStartWorld = null;
      return;
    }

    if (this.dragging && this.dragCardIds.length > 0 && this.dragStartWorld) {
      const world = state.worldPosition;
      const dx = world.x - this.dragStartWorld.x;
      const dy = world.y - this.dragStartWorld.y;

      // First undo the live preview positions
      for (const entry of this.dragStartPositions) {
        const card = this.boardManager.getCard(entry.id);
        if (card) {
          card.position = { x: entry.x, y: entry.y };
        }
      }

      // Then execute the move command
      const entries = this.dragStartPositions.map(entry => ({
        cardId: entry.id,
        from: { x: entry.x, y: entry.y },
        to: { x: entry.x + dx, y: entry.y + dy },
      }));

      const cmd = new MoveCardsCommand(entries);
      this.historyManager.executeCommand(cmd);

      // Mark connections dirty
      for (const id of this.dragCardIds) {
        this.boardManager.markConnectionsDirty(
          this.boardManager.getConnectionIdsForCard(id),
        );
      }
    }

    this.dragging = false;
    this.dragCardIds = [];
    this.dragStartPositions = [];
    this.dragStartWorld = null;
  }

  onWheel(state: InputState, deltaY: number): void {
    const zoomDelta = deltaY > 0 ? 0.9 : 1.1;
    this.cameraManager.zoomAt(state.screenPosition, zoomDelta);
  }

  onKeyDown(_key: string, _state: InputState): void {}
  onKeyUp(_key: string, _state: InputState): void {}

  deactivate(): void {
    this.dragging = false;
    this.dragCardIds = [];
    this.selectingRect = false;
  }
}