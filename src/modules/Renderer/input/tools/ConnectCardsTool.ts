import { BaseTool } from './BaseTool';
import type { InputState } from '../InputState';
import type { CameraManager } from '../../camera/CameraManager';
import type { SelectionManager } from '../../managers/SelectionManager';
import type { ConnectionManager } from '../../managers/ConnectionManager';
import type { HistoryManager } from '../../managers/HistoryManager';
import type { CardId } from '../../types';
import { ConnectCardsCommand } from '../../commands/ConnectCardsCommand';
import { generateId } from '../../utils';

export class ConnectCardsTool extends BaseTool {
  name = 'connect';
  private sourceCardId: CardId | null = null;
  private isConnecting = false;
  private currentPoint: { x: number; y: number } | null = null;

  constructor(
    private selectionManager: SelectionManager,
    private connectionManager: ConnectionManager,
    private historyManager: HistoryManager,
  ) { super(); }

  onPointerDown(state: InputState): void {
    const hitIds = state.hoveredCardId ? [state.hoveredCardId] : [];
    if (hitIds.length > 0) {
      const cardId = hitIds[0];
      if (this.isConnecting && this.sourceCardId && cardId !== this.sourceCardId) {
        // Complete connection
        this.connectionManager.createConnection(this.sourceCardId, cardId);
        this.isConnecting = false;
        this.sourceCardId = null;
        this.currentPoint = null;
      } else {
        this.sourceCardId = cardId;
        this.isConnecting = true;
        this.currentPoint = state.worldPosition;
      }
    }
  }

  onPointerMove(state: InputState): void {
    if (this.isConnecting) {
      this.currentPoint = state.worldPosition;
    }
  }

  onPointerUp(_state: InputState): void {}

  onWheel(state: InputState, deltaY: number): void {}

  onKeyDown(key: string, _state: InputState): void {
    if (key === 'Escape') {
      this.isConnecting = false;
      this.sourceCardId = null;
      this.currentPoint = null;
    }
  }

  onKeyUp(_key: string, _state: InputState): void {}

  getPreviewLine(): { from: CardId; to: { x: number; y: number } } | null {
    if (this.isConnecting && this.sourceCardId && this.currentPoint) {
      return { from: this.sourceCardId, to: this.currentPoint };
    }
    return null;
  }

  deactivate(): void {
    this.isConnecting = false;
    this.sourceCardId = null;
    this.currentPoint = null;
  }
}