import type { Rect, Bounds, Point, CardId, ConnectionId } from '../types';

export interface SpatialIndex<TId extends string = string> {
  insert(id: TId, bounds: Bounds): void;
  update(id: TId, bounds: Bounds): void;
  remove(id: TId): void;
  queryRect(rect: Rect): TId[];
  queryPoint(point: Point): TId[];
  clear(): void;
}
