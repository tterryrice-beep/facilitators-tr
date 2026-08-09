import type { Rect, Bounds, Point } from '../types';

export function rectToBounds(r: Rect): Bounds {
  return { minX: r.x, minY: r.y, maxX: r.x + r.width, maxY: r.y + r.height };
}

export function boundsToRect(b: Bounds): Rect {
  return { x: b.minX, y: b.minY, width: b.maxX - b.minX, height: b.maxY - b.minY };
}

export function boundsIntersect(a: Bounds, b: Bounds): boolean {
  return !(a.maxX < b.minX || a.minX > b.maxX || a.maxY < b.minY || a.minY > b.maxY);
}

export function boundsContainsPoint(b: Bounds, p: Point): boolean {
  return p.x >= b.minX && p.x <= b.maxX && p.y >= b.minY && p.y <= b.maxY;
}

export function boundsFromRect(r: Rect): Bounds {
  return { minX: r.x, minY: r.y, maxX: r.x + r.width, maxY: r.y + r.height };
}

export function unionBounds(a: Bounds, b: Bounds): Bounds {
  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY),
  };
}

export function expandBounds(b: Bounds, padding: number): Bounds {
  return {
    minX: b.minX - padding,
    minY: b.minY - padding,
    maxX: b.maxX + padding,
    maxY: b.maxY + padding,
  };
}

export function boundsFromPoints(x: number, y: number, w: number, h: number): Bounds {
  return { minX: x, minY: y, maxX: x + w, maxY: y + h };
}
