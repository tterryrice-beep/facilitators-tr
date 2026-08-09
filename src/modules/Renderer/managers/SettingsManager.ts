import type { BoardSettings } from '../types';
import type { IBoardReader, IBoardMutator } from '../core/RendererContext';
import { DEFAULT_BOARD_SETTINGS } from '../core/constants';

export class SettingsManager {
  constructor(
    private boardReader: IBoardReader,
    private boardMutator: IBoardMutator,
  ) {}

  getSettings(): BoardSettings {
    return this.boardReader.getSettings();
  }

  updateGrid(enabled: boolean): void {
    const s = this.boardReader.getSettings();
    s.grid.enabled = enabled;
    this.boardMutator.setSettings(s);
  }

  updateSettings(partial: Partial<BoardSettings>): void {
    const s = { ...this.boardReader.getSettings(), ...partial };
    this.boardMutator.setSettings(s);
  }
}