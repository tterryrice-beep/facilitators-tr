import type { Command, CommandContext } from './Command';
import type { Connection, ConnectionId } from '../types';
import { generateId, deepClone } from '../utils';

export class ConnectCardsCommand implements Command {
  id = generateId('cmd');
  label = 'Connect Cards';
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = deepClone(connection);
  }

  execute(ctx: CommandContext): void {
    ctx.board.connections[this.connection.id] = deepClone(this.connection);
  }

  undo(ctx: CommandContext): void {
    delete ctx.board.connections[this.connection.id];
  }
}