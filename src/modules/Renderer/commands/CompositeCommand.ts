import type { Command, CommandContext } from './Command';
import { generateId } from '../utils';

export class CompositeCommand implements Command {
  id = generateId('cmd');
  label = 'Composite';
  private commands: Command[];

  constructor(label: string, commands: Command[]) {
    this.label = label;
    this.commands = commands;
  }

  execute(ctx: CommandContext): void {
    for (const cmd of this.commands) {
      cmd.execute(ctx);
    }
  }

  undo(ctx: CommandContext): void {
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo(ctx);
    }
  }
}