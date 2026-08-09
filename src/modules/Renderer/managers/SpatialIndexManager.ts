import type { CardId, Bounds } from '../types';
import type { ISpatialIndexUpdater } from '../core/RendererContext';
import { UniformGridIndex, type SpatialIndex } from '../spatial';
import { SPATIAL_CELL_SIZE } from '../core/constants';

export class SpatialIndexManager implements ISpatialIndexUpdater {
  readonly cardIndex: SpatialIndex<CardId>;

  constructor(cellSize = SPATIAL_CELL_SIZE) {
    this.cardIndex = new UniformGridIndex<CardId>(cellSize);
  }

  updateCardSpatial(cardId: CardId, bounds: Bounds): void {
    this.cardIndex.update(cardId, bounds);
  }

  removeCardSpatial(cardId: CardId): void {
    this.cardIndex.remove(cardId);
  }

  clear(): void {
    this.cardIndex.clear();
  }
}