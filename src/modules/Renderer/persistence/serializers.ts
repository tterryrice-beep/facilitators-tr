import type { Board, Card, Connection } from '../../types';

export function serializeBoard(board: Board): string {
  // Convert Sets if any (though domain state uses Records, so Sets are only in runtime)
  return JSON.stringify({ schemaVersion: 1, board });
}

export function deserializeBoard(json: string): Board | null {
  try {
    const data = JSON.parse(json);
    if (!data || !data.board) return null;
    return data.board as Board;
  } catch {
    return null;
  }
}