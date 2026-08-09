import type { Board, Card, Connection, CameraState, BoardSettings, SelectionState, CardId, ConnectionId, Point, Size, Rect, Bounds, ClipboardPayload } from '../types';
import type { Command } from '../commands';

/** Read-only access to board domain state */
export interface IBoardReader {
  getBoard(): Readonly<Board>;
  getCards(): Readonly<Record<CardId, Card>>;
  getConnections(): Readonly<Record<ConnectionId, Connection>>;
  getCameraState(): CameraState;
  getSettings(): BoardSettings;
  getCard(id: CardId): Card | undefined;
  getConnection(id: ConnectionId): Connection | undefined;
}

/** Mutation interface for board domain state (used by commands) */
export interface IBoardMutator {
  // Low-level mutations; most users go through HistoryManager
  setCards(cards: Record<CardId, Card>): void;
  setConnections(connections: Record<ConnectionId, Connection>): void;
  setCameraState(state: CameraState): void;
  setSettings(settings: BoardSettings): void;
  markCardsDirty(cardIds: CardId[]): void;
  markConnectionsDirty(connectionIds: ConnectionId[]): void;
  markAllCardsDirty(): void;
  markAllConnectionsDirty(): void;
}

/** Render invalidation */
export interface IRenderInvalidator {
  markDirtyCards(cardIds: CardId[]): void;
  markDirtyConnections(connectionIds: ConnectionId[]): void;
  markAllDirty(): void;
}

/** Spatial index updater */
export interface ISpatialIndexUpdater {
  updateCardSpatial(cardId: CardId, bounds: Bounds): void;
  removeCardSpatial(cardId: CardId): void;
}

/** Command executor */
export interface ICommandExecutor {
  executeCommand(cmd: Command): void;
  undo(): void;
  redo(): void;
}

/** Camera reader */
export interface ICameraReader {
  getCameraState(): CameraState;
  screenToWorld(point: Point): Point;
  worldToScreen(point: Point): Point;
}

/** Camera controller */
export interface ICameraController {
  panBy(delta: Point): void;
  zoomAt(screenPoint: Point, delta: number): void;
  fitBounds(rect: Rect, screenW: number, screenH: number): void;
  setZoom(zoom: number): void;
}

/** Selection reader */
export interface ISelectionReader {
  getSelection(): SelectionState;
  isSelected(cardId: CardId): boolean;
  getSelectedCardIds(): CardId[];
  getPrimaryCardId(): CardId | undefined;
}

/** Clipboard operations result type */
export interface IClipboardOps {
  copySelectedCards(): void;
  pasteCardsAtScreen(screenPoint: Point): void;
  duplicateSelected(): void;
  hasClipboard(): boolean;
}