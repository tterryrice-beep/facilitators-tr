import type { Command } from '../../commands/Command';
import type { Board } from '../../types';
import type { InputState } from '../InputState';

export interface IToolContext {
  inputState: InputState;
  board: Board;
}

export abstract class BaseTool {
  abstract readonly name: string;
  abstract onPointerDown(state: InputState): void;
  abstract onPointerMove(state: InputState): void;
  abstract onPointerUp(state: InputState): void;
  abstract onWheel(state: InputState, deltaY: number): void;
  abstract onKeyDown(key: string, state: InputState): void;
  abstract onKeyUp(key: string, state: InputState): void;
  abstract deactivate(): void;
}