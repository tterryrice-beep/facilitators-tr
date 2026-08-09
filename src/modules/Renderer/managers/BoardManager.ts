import type {
  Board, Card, Connection,
  CardId, ConnectionId, CameraState,
  BoardSettings,
} from '../types';
import type { IBoardReader, IBoardMutator, IRenderInvalidator, ISpatialIndexUpdater } from '../core/RendererContext';
import { generateId } from '../utils';
import { DEFAULT_BOARD_SETTINGS, DEFAULT_CAMERA_STATE } from '../core/constants';

export class BoardManager implements IBoardReader, IBoardMutator {
  private board!: Board;
  private renderInvalidator: IRenderInvalidator | null = null;
  private spatialUpdater: ISpatialIndexUpdater | null = null;

  private dirtyCards = new Set<CardId>();
  private dirtyConnections = new Set<ConnectionId>();
  private allCardsDirty = false;
  private allConnectionsDirty = false;

  constructor() { this.initEmpty(); }

  setRenderInvalidator(inv: IRenderInvalidator): void { this.renderInvalidator = inv; }
  setSpatialUpdater(up: ISpatialIndexUpdater): void { this.spatialUpdater = up; }

  // BoardReader
  getBoard(): Readonly<Board> { return this.board; }
  getCards(): Readonly<Record<CardId, Card>> { return this.board.cards; }
  getConnections(): Readonly<Record<ConnectionId, Connection>> { return this.board.connections; }
  getCameraState(): CameraState { return { ...this.board.camera }; }
  getSettings(): BoardSettings { return { ...this.board.settings }; }
  getCard(id: CardId): Card | undefined { return this.board.cards[id]; }
  getConnection(id: ConnectionId): Connection | undefined { return this.board.connections[id]; }

  // BoardMutator
  setCards(cards: Record<CardId, Card>): void { this.board.cards = cards; this.markAllCardsDirty(); }
  setConnections(conns: Record<ConnectionId, Connection>): void { this.board.connections = conns; this.markAllConnectionsDirty(); }
  setCameraState(state: CameraState): void { this.board.camera = state; this.board.metadata.updatedAt = Date.now(); }
  setSettings(settings: BoardSettings): void { this.board.settings = settings; this.board.metadata.updatedAt = Date.now(); }

  // Dirty tracking
  markCardsDirty(cardIds: CardId[]): void {
    if (this.allCardsDirty) return;
    for (const id of cardIds) this.dirtyCards.add(id);
  }
  markConnectionsDirty(connectionIds: ConnectionId[]): void {
    if (this.allConnectionsDirty) return;
    for (const id of connectionIds) this.dirtyConnections.add(id);
  }
  markAllCardsDirty(): void { this.allCardsDirty = true; this.dirtyCards.clear(); }
  markAllConnectionsDirty(): void { this.allConnectionsDirty = true; this.dirtyConnections.clear(); }

  getAndClearDirtyCards(): CardId[] {
    if (this.allCardsDirty) { this.allCardsDirty = false; return Object.keys(this.board.cards); }
    const ids = Array.from(this.dirtyCards); this.dirtyCards.clear(); return ids;
  }

  getAndClearDirtyConnections(): ConnectionId[] {
    if (this.allConnectionsDirty) { this.allConnectionsDirty = false; return Object.keys(this.board.connections); }
    const ids = Array.from(this.dirtyConnections); this.dirtyConnections.clear(); return ids;
  }

  // Board lifecycle
  initEmpty(): void {
    const now = Date.now();
    this.board = {
      id: generateId('board'), version: 1, name: 'Untitled Board',
      cards: {}, connections: {},
      camera: { ...DEFAULT_CAMERA_STATE },
      settings: { ...DEFAULT_BOARD_SETTINGS },
      metadata: { createdAt: now, updatedAt: now },
    };
    this.markAllCardsDirty(); this.markAllConnectionsDirty();
  }

  loadBoard(board: Board): void {
    this.board = board;
    this.markAllCardsDirty(); this.markAllConnectionsDirty();
  }

  // Card helpers
  addCard(card: Card): void { this.board.cards[card.id] = card; this.dirtyCards.add(card.id); this.board.metadata.updatedAt = Date.now(); }
  removeCard(cardId: CardId): void { delete this.board.cards[cardId]; this.board.metadata.updatedAt = Date.now(); }

  updateCardPosition(cardId: CardId, pos: { x: number; y: number }): void {
    const card = this.board.cards[cardId];
    if (card) { card.position = pos; card.updatedAt = Date.now(); this.dirtyCards.add(cardId); }
  }

  updateCardSize(cardId: CardId, size: { width: number; height: number }): void {
    const card = this.board.cards[cardId];
    if (card) { card.size = size; card.updatedAt = Date.now(); this.dirtyCards.add(cardId); }
  }

  updateCardZIndex(cardId: CardId, zIndex: number): void {
    const card = this.board.cards[cardId];
    if (card) { card.zIndex = zIndex; card.updatedAt = Date.now(); this.dirtyCards.add(cardId); }
  }

  // Connection helpers
  addConnection(conn: Connection): void {
    this.board.connections[conn.id] = conn;
    this.dirtyConnections.add(conn.id);
    this.board.metadata.updatedAt = Date.now();
  }

  removeConnection(connId: ConnectionId): void {
    delete this.board.connections[connId];
    this.board.metadata.updatedAt = Date.now();
  }

  getConnectionIdsForCard(cardId: CardId): ConnectionId[] {
    const ids: ConnectionId[] = [];
    for (const [connId, conn] of Object.entries(this.board.connections)) {
      if (conn.fromCardId === cardId || conn.toCardId === cardId) {
        ids.push(connId as ConnectionId);
      }
    }
    return ids;
  }

  rebuildSpatial(): void {
    if (!this.spatialUpdater) return;
    for (const [, card] of Object.entries(this.board.cards)) {
      this.spatialUpdater.updateCardSpatial(card.id, {
        minX: card.position.x, minY: card.position.y,
        maxX: card.position.x + card.size.width, maxY: card.position.y + card.size.height,
      });
    }
  }
}
