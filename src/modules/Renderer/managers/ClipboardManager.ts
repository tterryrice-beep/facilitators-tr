import type { Card, Connection, CardId, ConnectionId, BoardId, ClipboardPayload, Point } from '../types';
import type { IBoardReader, ICommandExecutor } from '../core/RendererContext';
import { generateId, deepClone } from '../utils';
import { CreateCardCommand, ConnectCardsCommand, CompositeCommand } from '../commands';
import { PASTE_OFFSET } from '../core/constants';

export class ClipboardManager {
  private payload: ClipboardPayload | null = null;

  constructor(
    private boardReader: IBoardReader,
    private commandExecutor: ICommandExecutor,
    private getCardIdsFn: () => CardId[],
  ) {}

  copySelectedCards(): void {
    const selectedIds = this.getCardIdsFn();
    if (selectedIds.length === 0) return;

    const cards: Card[] = [];
    const connections: Connection[] = [];
    const selectedSet = new Set(selectedIds);

    for (const id of selectedIds) {
      const card = this.boardReader.getCard(id);
      if (card) cards.push(deepClone(card));
    }

    const allConns = this.boardReader.getConnections();
    for (const [, conn] of Object.entries(allConns)) {
      if (selectedSet.has(conn.fromCardId) && selectedSet.has(conn.toCardId)) {
        connections.push(deepClone(conn));
      }
    }

    this.payload = {
      version: 1,
      cards,
      connections,
      sourceBoardId: this.boardReader.getBoard().id as BoardId,
      copiedAt: Date.now(),
    };
  }

  pasteCardsAtScreen(screenPoint: Point): void {
    if (!this.payload || this.payload.cards.length === 0) return;

    const oldToNew = new Map<CardId, CardId>();
    const cmds: Array<CreateCardCommand | ConnectCardsCommand> = [];

    // Compute offset
    const firstPos = this.payload.cards[0].position;
    const offset: Point = PASTE_OFFSET;

    for (const card of this.payload.cards) {
      const newId = generateId('card');
      oldToNew.set(card.id, newId);
      const newCard: Card = {
        ...deepClone(card),
        id: newId,
        position: {
          x: card.position.x + offset.x,
          y: card.position.y + offset.y,
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      cmds.push(new CreateCardCommand(newCard));
    }

    for (const conn of this.payload.connections) {
      const newFrom = oldToNew.get(conn.fromCardId);
      const newTo = oldToNew.get(conn.toCardId);
      if (newFrom && newTo) {
        const newConn: Connection = {
          ...deepClone(conn),
          id: generateId('conn'),
          fromCardId: newFrom,
          toCardId: newTo,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        cmds.push(new ConnectCardsCommand(newConn));
      }
    }

    if (cmds.length === 0) return;
    const composite = new CompositeCommand('Paste', cmds);
    this.commandExecutor.executeCommand(composite);
  }

  duplicateSelected(): void {
    this.copySelectedCards();
    if (this.payload) {
      this.pasteCardsAtScreen({ x: 0, y: 0 });
    }
  }

  hasClipboard(): boolean {
    return this.payload !== null && this.payload.cards.length > 0;
  }
}