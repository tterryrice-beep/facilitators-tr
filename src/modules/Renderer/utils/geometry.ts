import type { Rect, Bounds, Point } from '../types';

export function boundsToRect(bounds: Bounds): Rect {
  return { x: bounds.minX, y: bounds.minY, width: bounds.maxX - bounds.minX, height: bounds.maxY - bounds.minY };
}

export function pointDistance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function pointAdd(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function pointSubtract(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y };
}
