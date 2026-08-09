import type { Card, CardId, Point, Size, Bounds, ConnectionId } from '../types';
import type { IBoardReader, ISpatialIndexUpdater, IRenderInvalidator, ICommandExecutor } from '../core/RendererContext';
import { generateId } from '../utils';
import { CreateCardCommand, DeleteCardsCommand } from '../commands';
import { SPATIAL_CELL_SIZE } from '../core/constants';

export class CardManager {
  constructor(
    private boardReader: IBoardReader,
    private commandExecutor: ICommandExecutor,
    private spatialUpdater: ISpatialIndexUpdater,
    private renderInvalidator: IRenderInvalidator,
  ) {}

  createCard(opts: {
    position?: Point;
    size?: Size;
    title?: string;
    text?: string;
    color?: string;
    imageUrl?: string;
  }): CardId {
    const now = Date.now();
    const card: Card = {
      id: generateId('card'),
      title: opts.title ?? 'New Card',
      text: opts.text ?? '',
      color: opts.color ?? '#2d3748',
      imageUrl: opts.imageUrl,
      position: opts.position ?? { x: 0, y: 0 },
      size: opts.size ?? { width: 200, height: 120 },
      zIndex: Date.now(),
      createdAt: now,
      updatedAt: now,
    };

    const cmd = new CreateCardCommand(card);
    this.commandExecutor.executeCommand(cmd);
    this.updateSpatial(card.id, card.position, card.size);
    return card.id;
  }

  deleteCards(cardIds: CardId[]): void {
    const cmd = new DeleteCardsCommand(cardIds);
    this.commandExecutor.executeCommand(cmd);
    for (const id of cardIds) this.spatialUpdater.removeCardSpatial(id);
  }

  getCardBounds(cardId: CardId): Bounds | null {
    const card = this.boardReader.getCard(cardId);
    if (!card) return null;
    return {
      minX: card.position.x, minY: card.position.y,
      maxX: card.position.x + card.size.width, maxY: card.position.y + card.size.height,
    };
  }

  updateSpatial(cardId: CardId, position: Point, size: Size): void {
    this.spatialUpdater.updateCardSpatial(cardId, {
      minX: position.x, minY: position.y,
      maxX: position.x + size.width, maxY: position.y + size.height,
    });
  }
}