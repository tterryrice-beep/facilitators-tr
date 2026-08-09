import type { Command, CommandContext } from './Command';
import type { Connection, ConnectionId } from '../types';
import { generateId, deepClone } from '../utils';

export class DisconnectCardsCommand implements Command {
  id = generateId('cmd');
  label = 'Disconnect Cards';
  private connections: Record<ConnectionId, Connection> = {};

  constructor(connectionIds: ConnectionId[]) {
    this.connections = {};
  }

  execute(ctx: CommandContext): void {
    for (const connId of Object.keys(this.connections)) {
      const conn = ctx.board.connections[connId as ConnectionId];
      if (conn) {
        this.connections[connId as ConnectionId] = deepClone(conn);
        delete ctx.board.connections[connId as ConnectionId];
      }
    }
  }

  undo(ctx: CommandContext): void {
    for (const [id, conn] of Object.entries(this.connections)) {
      ctx.board.connections[id as ConnectionId] = deepClone(conn);
    }
  }
}