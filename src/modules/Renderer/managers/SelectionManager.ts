import type { CardId, ConnectionId, SelectionState, Rect } from '../types';
import type { ISelectionReader } from '../core/RendererContext';
import type { SpatialIndex } from '../spatial';

export class SelectionManager implements ISelectionReader {
  private state: SelectionState = {
    selectedCardIds: new Set(),
    selectedConnectionIds: new Set(),
  };

  // Event listeners
  private onChangeListeners: Array<() => void> = [];

  constructor(private spatialIndex: SpatialIndex<CardId>) {}

  onChange(fn: () => void): () => void {
    this.onChangeListeners.push(fn);
    return () => {
      this.onChangeListeners = this.onChangeListeners.filter(l => l !== fn);
    };
  }

  getSelection(): SelectionState { return this.state; }

  isSelected(cardId: CardId): boolean { return this.state.selectedCardIds.has(cardId); }

  getSelectedCardIds(): CardId[] { return Array.from(this.state.selectedCardIds); }

  getPrimaryCardId(): CardId | undefined { return this.state.primaryCardId; }

  selectCard(cardId: CardId, toggle = false): void {
    if (toggle && this.state.selectedCardIds.has(cardId)) {
      this.state.selectedCardIds.delete(cardId);
    } else {
      if (!toggle) this.clearSelection();
      this.state.selectedCardIds.add(cardId);
    }
    this.state.primaryCardId = cardId;
    this.state.selectionRect = undefined;
    this.notify();
  }

  selectCards(cardIds: CardId[]): void {
    this.clearSelection();
    for (const id of cardIds) this.state.selectedCardIds.add(id);
    if (cardIds.length > 0) this.state.primaryCardId = cardIds[0];
    this.state.selectionRect = undefined;
    this.notify();
  }

  selectAll(): void {
    // Handled externally by selecting all card IDs
    this.notify();
  }

  selectByRectangle(rect: Rect): void {
    this.state.selectionRect = rect;
    this.clearSelection();
    const ids = this.spatialIndex.queryRect(rect);
    for (const id of ids) this.state.selectedCardIds.add(id);
    if (ids.length > 0) this.state.primaryCardId = ids[0] as CardId;
    this.notify();
  }

  clearSelection(): void {
    this.state.selectedCardIds.clear();
    this.state.selectedConnectionIds.clear();
    this.state.primaryCardId = undefined;
    this.state.selectionRect = undefined;
    this.notify();
  }

  deleteSelectedFromState(cardIds: CardId[]): void {
    for (const id of cardIds) this.state.selectedCardIds.delete(id);
    if (this.state.primaryCardId && cardIds.includes(this.state.primaryCardId)) {
      this.state.primaryCardId = this.getSelectedCardIds()[0];
    }
    this.notify();
  }

  selectConnection(connId: ConnectionId): void {
    this.state.selectedConnectionIds.add(connId);
    this.notify();
  }

  private notify(): void {
    for (const fn of this.onChangeListeners) fn();
  }
}