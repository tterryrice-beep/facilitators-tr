import type { Point, CardId } from '../../types';

export interface InputState {
  primaryPointer: PointerData | null;
  pointers: Map<number, PointerData>;
  screenPosition: Point;
  worldPosition: Point;
  pressedButtons: Set<number>;
  modifierKeys: ModifierKeys;
  dragStart: Point | null;
  dragDelta: Point;
  hoveredCardId: CardId | null;
  isDragging: boolean;
}

export interface PointerData {
  id: number;
  screenX: number;
  screenY: number;
  button: number;
  isDown: boolean;
}

export interface ModifierKeys {
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
}

export function createEmptyInputState(): InputState {
  return {
    primaryPointer: null,
    pointers: new Map(),
    screenPosition: { x: 0, y: 0 },
    worldPosition: { x: 0, y: 0 },
    pressedButtons: new Set(),
    modifierKeys: { ctrl: false, shift: false, alt: false, meta: false },
    dragStart: null,
    dragDelta: { x: 0, y: 0 },
    hoveredCardId: null,
    isDragging: false,
  };
}