import type { Command, CommandContext } from './Command';
import type { Card, Connection, CardId, ConnectionId } from '../types';
import { generateId, deepClone } from '../utils';

export class DeleteCardsCommand implements Command {
  id = generateId('cmd');
  label = 'Delete Cards';
  private cardIds: CardId[];
  private deletedCards: Record<CardId, Card> = {};
  private deletedConnections: Record<ConnectionId, Connection> = {};

  constructor(cardIds: CardId[]) {
    this.cardIds = [...cardIds];
  }

  execute(ctx: CommandContext): void {
    this.deletedCards = {};
    this.deletedConnections = {};

    for (const cardId of this.cardIds) {
      const card = ctx.board.cards[cardId];
      if (card) {
        this.deletedCards[cardId] = deepClone(card);
        delete ctx.board.cards[cardId];
      }
    }

    // Also delete any connections involving deleted cards
    for (const [connId, conn] of Object.entries(ctx.board.connections)) {
      if (this.cardIds.includes(conn.fromCardId) || this.cardIds.includes(conn.toCardId)) {
        this.deletedConnections[connId as ConnectionId] = deepClone(conn);
        delete ctx.board.connections[connId as ConnectionId];
      }
    }
  }

  undo(ctx: CommandContext): void {
    for (const [id, card] of Object.entries(this.deletedCards)) {
      ctx.board.cards[id as CardId] = deepClone(card);
    }
    for (const [id, conn] of Object.entries(this.deletedConnections)) {
      ctx.board.connections[id as ConnectionId] = deepClone(conn);
    }
  }
}