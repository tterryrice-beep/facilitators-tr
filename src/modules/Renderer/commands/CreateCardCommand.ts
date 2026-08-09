import type { Command, CommandContext } from './Command';
import type { Card } from '../types';
import { generateId, deepClone } from '../utils';

export class CreateCardCommand implements Command {
  id = generateId('cmd');
  label = 'Create Card';
  private card: Card;

  constructor(card: Card) {
    this.card = deepClone(card);
  }

  execute(ctx: CommandContext): void {
    ctx.board.cards[this.card.id] = deepClone(this.card);
  }

  undo(ctx: CommandContext): void {
    delete ctx.board.cards[this.card.id];
  }
}