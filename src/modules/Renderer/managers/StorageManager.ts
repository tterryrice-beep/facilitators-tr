import type { Board, PersistedBoardPayload } from '../types';
import type { IBoardReader } from '../core/RendererContext';
import { debounce, deepClone } from '../utils';
import { DEFAULT_BOARD_SETTINGS } from '../core/constants';

const SCHEMA_VERSION = 1;

export interface PersistedBoardPayload {
  schemaVersion: number;
  board: Board;
}

export class StorageManager {
  private saveFn: () => void;
  private loaded = false;

  constructor(
    private boardReader: IBoardReader,
    private onLoad: (board: Board) => void,
    private getBoardId: () => string,
  ) {
    const settings = boardReader.getSettings();
    this.saveFn = debounce(() => this.saveNow(), settings.storage.debounceMs);
  }

  load(): Board | null {
    try {
      const key = this.getStorageKey();
      const raw = localStorage.getItem(key);
      if (!raw) return null;

      const payload: PersistedBoardPayload = JSON.parse(raw);
      if (!payload || typeof payload.schemaVersion !== 'number') return null;

      const board = this.migrateIfNeeded(payload);
      this.loaded = true;
      return board;
    } catch (err) {
      console.warn('[StorageManager] Failed to load board:', err);
      return null;
    }
  }

  scheduleSave(): void {
    this.saveFn();
  }

  saveNow(): void {
    try {
      const board = this.boardReader.getBoard();
      const serialized: PersistedBoardPayload = {
        schemaVersion: SCHEMA_VERSION,
        board: deepClone(board),
      };
      // Convert Sets to arrays for JSON
      const key = this.getStorageKey();
      localStorage.setItem(key, JSON.stringify(serialized));
    } catch (err) {
      console.error('[StorageManager] Save failed:', err);
    }
  }

  private getStorageKey(): string {
    const settings = this.boardReader.getSettings();
    return `${settings.storage.keyPrefix}${this.getBoardId()}`;
  }

  private migrateIfNeeded(payload: PersistedBoardPayload): Board {
    // MVP: no migrations needed yet, just return as-is
    return payload.board;
  }
}