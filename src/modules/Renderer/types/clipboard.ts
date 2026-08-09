import type { Card, Connection, BoardId } from './board';

export interface ClipboardPayload {
  version: number;
  cards: Card[];
  connections: Connection[];
  sourceBoardId: BoardId;
  copiedAt: number;
}
