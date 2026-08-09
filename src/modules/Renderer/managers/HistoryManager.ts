import type { Command } from '../commands/Command';
import type { Board, CardId, ConnectionId } from '../types';
import { HIST0RY_MAX_SIZE } from '../core/constants';

export interface IHistoryListener {
  onHistoryChanged(state: { canUndo: boolean; canRedo: boolean }): void;
}

export class HistoryManager {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  private limit: number = HIST0RY_MAX_SIZE;
  private listeners: IHistoryListener[] = [];

  private board!: Board;

  constructor() {}

  setBoard(board: Board): void { this.board = board; }

  onHistoryChanged(fn: IHistoryListener['onHistoryChanged']): () => void {
    const listener = { onHistoryChanged: fn };
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  executeCommand(cmd: Command): void {
    cmd.execute({ board: this.board });
    this.undoStack.push(cmd);
    if (this.undoStack.length > this.limit) this.undoStack.shift();
    this.redoStack = [];
    this.notify();
  }

  undo(): void {
    if (this.undoStack.length === 0) return;
    const cmd = this.undoStack.pop()!;
    cmd.undo({ board: this.board });
    this.redoStack.push(cmd);
    this.notify();
  }

  redo(): void {
    if (this.redoStack.length === 0) return;
    const cmd = this.redoStack.pop()!;
    cmd.execute({ board: this.board });
    this.undoStack.push(cmd);
    this.notify();
  }

  canUndo(): boolean { return this.undoStack.length > 0; }
  canRedo(): boolean { return this.redoStack.length > 0; }

  beginBatch(): void { /* Future use: composite command support */ }
  endBatch(label: string): void { /* Future use */ }

  private notify(): void {
    const state = { canUndo: this.canUndo(), canRedo: this.canRedo() };
    for (const l of this.listeners) l.onHistoryChanged(state);
  }

  dispose(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.listeners = [];
  }
}