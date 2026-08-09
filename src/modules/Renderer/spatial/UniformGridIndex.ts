import type { Rect, Bounds, Point } from '../types';
import type { SpatialIndex } from './SpatialIndex';
import { boundsIntersect, boundsContainsPoint } from './bounds';

interface CellKey {
  cx: number;
  cy: number;
}

export class UniformGridIndex<TId extends string> implements SpatialIndex<TId> {
  private cells = new Map<string, Set<TId>>();
  private entityCells = new Map<TId, Set<string>>();
  private entityBounds = new Map<TId, Bounds>();
  private readonly cellSize: number;

  constructor(cellSize = 256) {
    this.cellSize = cellSize;
  }

  insert(id: TId, bounds: Bounds): void {
    this.remove(id);
    this.entityBounds.set(id, bounds);
    const keys = this.getCellKeys(bounds);
    const keySet = new Set<string>();
    for (const key of keys) {
      keySet.add(key);
      let cell = this.cells.get(key);
      if (!cell) {
        cell = new Set();
        this.cells.set(key, cell);
      }
      cell.add(id);
    }
    this.entityCells.set(id, keySet);
  }

  update(id: TId, bounds: Bounds): void {
    this.insert(id, bounds);
  }

  remove(id: TId): void {
    const keys = this.entityCells.get(id);
    if (keys) {
      for (const key of keys) {
        const cell = this.cells.get(key);
        if (cell) {
          cell.delete(id);
          if (cell.size === 0) this.cells.delete(key);
        }
      }
      this.entityCells.delete(id);
    }
    this.entityBounds.delete(id);
  }

  queryRect(rect: Rect): TId[] {
    const keys = this.getRectKeys(rect);
    const result = new Set<TId>();
    for (const key of keys) {
      const cell = this.cells.get(key);
      if (cell) {
        for (const id of cell) {
          const bounds = this.entityBounds.get(id);
          if (bounds && boundsIntersect(bounds, { minX: rect.x, minY: rect.y, maxX: rect.x + rect.width, maxY: rect.y + rect.height })) {
            result.add(id);
          }
        }
      }
    }
    return Array.from(result);
  }

  queryPoint(point: Point): TId[] {
    const key = this.pointToKey(point);
    const cell = this.cells.get(key);
    if (!cell) return [];
    const result: TId[] = [];
    for (const id of cell) {
      const bounds = this.entityBounds.get(id);
      if (bounds && boundsContainsPoint(bounds, point)) {
        result.push(id);
      }
    }
    return result;
  }

  clear(): void {
    this.cells.clear();
    this.entityCells.clear();
    this.entityBounds.clear();
  }

  private getCellKeys(bounds: Bounds): string[] {
    return this.getRectKeys({ x: bounds.minX, y: bounds.minY, width: bounds.maxX - bounds.minX, height: bounds.maxY - bounds.minY });
  }

  private getRectKeys(rect: Rect): string[] {
    const minCX = Math.floor(rect.x / this.cellSize);
    const minCY = Math.floor(rect.y / this.cellSize);
    const maxCX = Math.floor((rect.x + rect.width) / this.cellSize);
    const maxCY = Math.floor((rect.y + rect.height) / this.cellSize);
    const keys: string[] = [];
    for (let cx = minCX; cx <= maxCX; cx++) {
      for (let cy = minCY; cy <= maxCY; cy++) {
        keys.push(`${cx}:${cy}`);
      }
    }
    return keys;
  }

  private pointToKey(p: Point): string {
    const cx = Math.floor(p.x / this.cellSize);
    const cy = Math.floor(p.y / this.cellSize);
    return `${cx}:${cy}`;
  }
}
