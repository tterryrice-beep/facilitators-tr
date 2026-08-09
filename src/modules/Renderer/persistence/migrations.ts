import type { Board } from '../../types';

// MVP: no migrations needed yet. This function exists as a hook point.
export function migrateBoard(board: Board, fromVersion: number, toVersion: number): Board {
  // Currently schema version is 1, no migrations
  return board;
}