import type { Command, CommandContext } from './Command';
import type { CardId, Point } from '../types';
import { generateId, deepClone } from '../utils';

interface MoveEntry {
  cardId: CardId;
  from: Point;
  to: Point;
}

export class MoveCardsCommand implements Command {
  id = generateId('cmd');
  label = 'Move Cards';
  private entries: MoveEntry[];

  constructor(entries: MoveEntry[]) {
    this.entries = entries;
  }

  execute(ctx: CommandContext): void {
    for (const entry of this.entries) {
      const card = ctx.board.cards[entry.cardId];
      if (card) {
        card.position = { ...entry.to };
        card.updatedAt = Date.now();
      }
    }
  }

  undo(ctx: CommandContext): void {
    for (const entry of this.entries) {
      const card = ctx.board.cards[entry.cardId];
      if (card) {
        card.position = { ...entry.from };
        card.updatedAt = Date.now();
      }
    }
  }

  canMergeWith(next: Command): boolean {
    if (!(next instanceof MoveCardsCommand)) return false;
    return this.entries.length === next.entries.length &&
           this.entries.every((e, i) => e.cardId === next.entries[i].cardId);
  }

  mergeWith(next: Command): Command {
    const nextMove = next as MoveCardsCommand;
    return new MoveCardsCommand(
      this.entries.map((e, i) => ({
        cardId: e.cardId,
        from: e.from,
        to: nextMove.entries[i].to,
      })),
    );
  }
}