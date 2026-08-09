import { BaseTool } from './BaseTool';
import type { InputState } from '../InputState';
import type { BoardManager } from '../../managers/BoardManager';
import type { ConnectionManager } from '../../managers/ConnectionManager';
import type { HistoryManager } from '../../managers/HistoryManager';
import type { CardId } from '../../types';

export class ConnectCardsTool extends BaseTool {
  name = 'connect';
  sourceCardId: CardId | null = null;
  isConnecting = false;
  currentPoint: { x: number; y: number } | null = null;
  private supressNextClick = false;

  constructor(
    private boardManager: BoardManager,
    private connectionManager: ConnectionManager,
    private historyManager: HistoryManager,
  ) { super(); }

  activate(cardId: CardId): void {
    this.sourceCardId = cardId;
    this.isConnecting = true;
    this.currentPoint = null;
    this.supressNextClick = true; // suppress the click that triggered the menu
  }

  onPointerDown(state: InputState): void {
    if (this.supressNextClick) { this.supressNextClick = false; return; }
    if (!this.isConnecting || !this.sourceCardId) return;
    const candidates = state.hoveredCardId ? [state.hoveredCardId] : [];
    if (candidates.length > 0 && candidates[0] !== this.sourceCardId) {
      this.connectionManager.createConnection(this.sourceCardId, candidates[0], { color: '#ff4444' });
      this.deactivate();
    }
  }

  onPointerMove(state: InputState): void {
    if (this.isConnecting) this.currentPoint = state.worldPosition;
  }

  onPointerUp(_state: InputState): void {}

  onWheel(_state: InputState, _deltaY: number): void {}

  onKeyDown(key: string, _state: InputState): void {
    if (key === 'Escape') { this.deactivate(); }
  }

  onKeyUp(_key: string, _state: InputState): void {}

  getPreview(): { cardId: CardId; point: { x: number; y: number } } | null {
    if (this.isConnecting && this.sourceCardId && this.currentPoint) {
      return { cardId: this.sourceCardId, point: this.currentPoint };
    }
    return null;
  }

  getSourceCardId(): CardId | null { return this.sourceCardId; }

  deactivate(): void {
    this.isConnecting = false;
    this.sourceCardId = null;
    this.currentPoint = null;
    this.supressNextClick = false;
  }
}
