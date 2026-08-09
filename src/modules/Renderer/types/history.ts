import type { Command } from '../commands/Command';

export interface HistoryState {
  undoStack: Command[];
  redoStack: Command[];
  limit: number;
  isExecuting: boolean;
}
