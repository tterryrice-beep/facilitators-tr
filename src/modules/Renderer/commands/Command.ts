import type { Board } from '../types';

export interface CommandContext {
  board: Board;
  // Additional context that commands may need (managers will be injected when executing)
}

export interface Command {
  id: string;
  label: string;
  execute(ctx: CommandContext): void;
  undo(ctx: CommandContext): void;
  canMergeWith?(next: Command): boolean;
  mergeWith?(next: Command): Command;
}