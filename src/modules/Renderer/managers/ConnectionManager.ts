import type { Connection, ConnectionId, CardId, Point } from '../types';
import type { IBoardReader, ICommandExecutor, IRenderInvalidator } from '../core/RendererContext';
import { generateId } from '../utils';
import { ConnectCardsCommand, DisconnectCardsCommand } from '../commands';

export class ConnectionManager {
  private connectionsByCardId = new Map<CardId, Set<ConnectionId>>();

  constructor(
    private boardReader: IBoardReader,
    private commandExecutor: ICommandExecutor,
    private renderInvalidator: IRenderInvalidator,
  ) {}

  createConnection(
    fromCardId: CardId,
    toCardId: CardId,
    style?: Partial<Connection['style']>,
  ): ConnectionId {
    const now = Date.now();
    const conn: Connection = {
      id: generateId('conn'),
      fromCardId, toCardId,
      fromAnchor: { type: 'center' },
      toAnchor: { type: 'center' },
      style: {
        color: style?.color ?? '#ffffff',
        width: style?.width ?? 2,
        dashed: style?.dashed ?? false,
      },
      createdAt: now, updatedAt: now,
    };

    const cmd = new ConnectCardsCommand(conn);
    this.commandExecutor.executeCommand(cmd);
    this.addToLookup(conn.id, fromCardId, toCardId);
    return conn.id;
  }

  deleteConnections(connectionIds: ConnectionId[]): void {
    for (const connId of connectionIds) {
      const conn = this.boardReader.getConnection(connId);
      if (conn) {
        this.removeFromLookup(connId, conn.fromCardId, conn.toCardId);
      }
    }
    const cmd = new DisconnectCardsCommand(connectionIds);
    this.commandExecutor.executeCommand(cmd);
  }

  getConnectionsForCard(cardId: CardId): ConnectionId[] {
    const set = this.connectionsByCardId.get(cardId);
    return set ? Array.from(set) : [];
  }

  getAnchorWorldPoint(cardId: CardId, anchorType: 'center' | 'edge', edge?: string): Point | null {
    const card = this.boardReader.getCard(cardId);
    if (!card) return null;
    const { x, y } = card.position;
    const { width, height } = card.size;

    if (anchorType === 'center' || !edge) {
      return { x: x + width / 2, y: y + height / 2 };
    }

    switch (edge) {
      case 'top': return { x: x + width / 2, y };
      case 'bottom': return { x: x + width / 2, y: y + height };
      case 'left': return { x, y: y + height / 2 };
      case 'right': return { x: x + width, y: y + height / 2 };
      default: return { x: x + width / 2, y: y + height / 2 };
    }
  }

  markConnectionsDirtyForCard(cardId: CardId): void {
    const connIds = this.getConnectionsForCard(cardId);
    if (connIds.length > 0) {
      this.renderInvalidator.markDirtyConnections(connIds);
    }
  }

  rebuildLookup(): void {
    this.connectionsByCardId.clear();
    const conns = this.boardReader.getConnections();
    for (const [connId, conn] of Object.entries(conns)) {
      this.addToLookup(connId as ConnectionId, conn.fromCardId, conn.toCardId);
    }
  }

  private addToLookup(connId: ConnectionId, from: CardId, to: CardId): void {
    for (const cardId of [from, to]) {
      let set = this.connectionsByCardId.get(cardId);
      if (!set) { set = new Set(); this.connectionsByCardId.set(cardId, set); }
      set.add(connId);
    }
  }

  private removeFromLookup(connId: ConnectionId, from: CardId, to: CardId): void {
    for (const cardId of [from, to]) {
      const set = this.connectionsByCardId.get(cardId);
      if (set) { set.delete(connId); if (set.size === 0) this.connectionsByCardId.delete(cardId); }
    }
  }
}