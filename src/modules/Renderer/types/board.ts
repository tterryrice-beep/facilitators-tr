import type { Point, Size } from './geometry';

// ── ID types ──────────────────────────────────────────────────────────
export type BoardId = string;
export type CardId = string;
export type ConnectionId = string;

// ── Board ─────────────────────────────────────────────────────────────
export interface Board {
  id: BoardId;
  version: number;
  name: string;
  cards: Record<CardId, Card>;
  connections: Record<ConnectionId, Connection>;
  camera: CameraState;
  settings: BoardSettings;
  metadata: BoardMetadata;
}

export interface BoardMetadata {
  createdAt: number;
  updatedAt: number;
}

// ── Card ──────────────────────────────────────────────────────────────
export interface Card {
  id: CardId;
  title: string;
  text: string;
  color?: string;
  imageUrl?: string;
  position: Point;
  size: Size;
  zIndex: number;
  createdAt: number;
  updatedAt: number;
}

// ── Connection ────────────────────────────────────────────────────────
export interface Connection {
  id: ConnectionId;
  fromCardId: CardId;
  toCardId: CardId;
  fromAnchor: ConnectionAnchor;
  toAnchor: ConnectionAnchor;
  style: ConnectionStyle;
  createdAt: number;
  updatedAt: number;
}

export interface ConnectionAnchor {
  type: 'center' | 'edge';
  edge?: 'top' | 'right' | 'bottom' | 'left';
  offset?: number;
}

export interface ConnectionStyle {
  color: string;
  width: number;
  dashed?: boolean;
  arrowStart?: boolean;
  arrowEnd?: boolean;
}

// ── Camera ────────────────────────────────────────────────────────────
export interface CameraState {
  x: number;
  y: number;
  zoom: number;
  minZoom: number;
  maxZoom: number;
}

// ── Selection ─────────────────────────────────────────────────────────
export interface SelectionState {
  selectedCardIds: Set<CardId>;
  selectedConnectionIds: Set<ConnectionId>;
  primaryCardId?: CardId;
  selectionRect?: Rect;
}

// ── Board Settings ────────────────────────────────────────────────────
export interface BoardSettings {
  grid: GridSettings;
  interaction: InteractionSettings;
  rendering: RenderingSettings;
  storage: StorageSettings;
}

export interface GridSettings {
  enabled: boolean;
  size: number;
  majorEvery: number;
  color: string;
  majorColor: string;
}

export interface InteractionSettings {
  dragThreshold: number;
  minCardWidth: number;
  minCardHeight: number;
}

export interface RenderingSettings {
  cullingEnabled: boolean;
  showDebugBounds: boolean;
  devicePixelRatioLimit: number;
  backgroundColor: string;
}

export interface StorageSettings {
  enabled: boolean;
  debounceMs: number;
  keyPrefix: string;
}

// Re-export from geometry
export type { Point, Size, Rect, Bounds } from './geometry';
export type { BoardId, CardId, ConnectionId };
