import type { CellCoord } from './types';

export interface CardEntity {
  id: string;
  title: string;
  text: string;
  connects: CardConnection[];
  coordinates: CellCoord;
  width: number;
  height: number;
  cells: CellCoord[];
}

export interface CardConnection {
  id: string;
  color: string;
}

export type CardMap = Record<string, CardEntity>;

export interface CellOccupancy {
  cardId: string | null;
}

export interface PlacementCheck {
  available: boolean;
  conflictingCardIds: string[];
}

export const CARD_STORAGE_KEY = 'cards.cardboard.entities';

export function readCards(): CardMap {
  try {
    const raw = localStorage.getItem(CARD_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CardMap;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    for (const card of Object.values(parsed)) {
      card.connects = Array.isArray(card.connects)
        ? card.connects.map((connection) => typeof connection === 'string'
          ? { id: connection, color: '#ffffff' }
          : connection)
        : [];
    }
    return parsed;
  } catch {
    return {};
  }
}

export function writeCards(cards: CardMap): void {
  localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(cards));
}

export function getCardCells(coordinates: CellCoord, width: number, height: number): CellCoord[] {
  const cells: CellCoord[] = [];
  for (let y = coordinates.y; y < coordinates.y + height; y += 1) {
    for (let x = coordinates.x; x < coordinates.x + width; x += 1) {
      cells.push({ x, y });
    }
  }
  return cells;
}

export function buildOccupancy(cards: CardMap): Map<string, CellOccupancy> {
  const occupancy = new Map<string, CellOccupancy>();
  for (const card of Object.values(cards)) {
    for (const cell of card.cells) occupancy.set(cellKey(cell), { cardId: card.id });
  }
  return occupancy;
}

export function checkPlacement(
  occupancy: Map<string, CellOccupancy>,
  coordinates: CellCoord,
  width: number,
  height: number,
  ignoredCardId?: string,
): PlacementCheck {
  const conflicts = new Set<string>();
  for (const cell of getCardCells(coordinates, width, height)) {
    const occupant = occupancy.get(cellKey(cell));
    if (occupant?.cardId && occupant.cardId !== ignoredCardId) conflicts.add(occupant.cardId);
  }
  return { available: conflicts.size === 0, conflictingCardIds: [...conflicts] };
}

/** Searches the nearest free position along four axis directions. */
export function findNearestFreePosition(
  occupancy: Map<string, CellOccupancy>,
  origin: CellCoord,
  width: number,
  height: number,
  ignoredCardId?: string,
): CellCoord {
  if (checkPlacement(occupancy, origin, width, height, ignoredCardId).available) return origin;

  for (let distance = 1; distance < 10000; distance += 1) {
    const candidates = [
      { x: origin.x + distance, y: origin.y },
      { x: origin.x - distance, y: origin.y },
      { x: origin.x, y: origin.y + distance },
      { x: origin.x, y: origin.y - distance },
    ];
    for (const candidate of candidates) {
      if (checkPlacement(occupancy, candidate, width, height, ignoredCardId).available) return candidate;
    }
  }
  return { ...origin };
}

export function cellKey(cell: CellCoord): string {
  return `${cell.x}:${cell.y}`;
}