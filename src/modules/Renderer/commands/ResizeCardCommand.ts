import type { Command, CommandContext } from './Command';
import type { CardId, Rect } from '../types';
import { generateId } from '../utils';

export class ResizeCardCommand implements Command {
  id = generateId('cmd');
  label = 'Resize Card';
  private cardId: CardId;
  private fromRect: Rect;
  private toRect: Rect;

  constructor(cardId: CardId, fromRect: Rect, toRect: Rect) {
    this.cardId = cardId;
    this.fromRect = fromRect;
    this.toRect = toRect;
  }

  execute(ctx: CommandContext): void {
    const card = ctx.board.cards[this.cardId];
    if (card) {
      card.position = { x: this.toRect.x, y: this.toRect.y };
      card.size = { width: this.toRect.width, height: this.toRect.height };
      card.updatedAt = Date.now();
    }
  }

  undo(ctx: CommandContext): void {
    const card = ctx.board.cards[this.cardId];
    if (card) {
      card.position = { x: this.fromRect.x, y: this.fromRect.y };
      card.size = { width: this.fromRect.width, height: this.fromRect.height };
      card.updatedAt = Date.now();
    }
  }
}