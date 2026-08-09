import type { Container } from 'pixi.js';
import type { Board, CardId, Point } from '../types';
import { RenderStarter } from './RenderStarter';
import { BoardManager } from '../managers/BoardManager';
import { CardManager } from '../managers/CardManager';
import { ConnectionManager } from '../managers/ConnectionManager';
import { SelectionManager } from '../managers/SelectionManager';
import { HistoryManager } from '../managers/HistoryManager';
import { ClipboardManager } from '../managers/ClipboardManager';
import { StorageManager } from '../managers/StorageManager';
import { SettingsManager } from '../managers/SettingsManager';
import { SpatialIndexManager } from '../managers/SpatialIndexManager';
import { CameraManager } from '../camera/CameraManager';
import { ViewportManager } from '../viewport/ViewportManager';
import { RenderManager } from '../render/RenderManager';
import { InputManager } from '../input/InputManager';
import { SPATIAL_CELL_SIZE } from './constants';

export interface BoardRendererOptions {
  wrapper: HTMLElement;
  boardId?: string;
}

export class BoardRenderer {
  private starter!: RenderStarter;
  private boardManager!: BoardManager;
  private spatialManager!: SpatialIndexManager;
  private historyManager!: HistoryManager;
  private selectionManager!: SelectionManager;
  private cameraManager!: CameraManager;
  private viewportManager!: ViewportManager;
  private cardManager!: CardManager;
  private connectionManager!: ConnectionManager;
  private clipboardManager!: ClipboardManager;
  private storageManager!: StorageManager;
  private settingsManager!: SettingsManager;
  private renderManager!: RenderManager;
  private inputManager!: InputManager;
  private destroyed = false;
  private tickerFn: (() => void) | null = null;
constructor(options: BoardRendererOptions) {
    const { wrapper } = options;

    // 1. PixiJS bootstrap
    this.starter = new RenderStarter(wrapper);

    // 2. Core managers
    this.boardManager = new BoardManager();
    this.historyManager = new HistoryManager();
    this.spatialManager = new SpatialIndexManager(SPATIAL_CELL_SIZE);
    this.cameraManager = new CameraManager();
    this.viewportManager = new ViewportManager(this.cameraManager.camera);

    // 3. History needs board access
    this.historyManager.setBoard(this.boardManager.getBoard() as Board);

    // 4. Selection
    this.selectionManager = new SelectionManager(this.spatialManager.cardIndex);

    // 5. Create command executor adapter
    const commandExecutor = {
      executeCommand: (cmd: any) => this.historyManager.executeCommand(cmd),
      undo: () => this.historyManager.undo(),
      redo: () => this.historyManager.redo(),
    };

    // 6. Render invalidator adapter
    // Will be set after render manager creation

    // 7. Spatial updater adapter
    const spatialUpdater = {
      updateCardSpatial: (id: any, bounds: any) => this.spatialManager.updateCardSpatial(id, bounds),
      removeCardSpatial: (id: any) => this.spatialManager.removeCardSpatial(id),
    };

    // Wire spatial updater to board manager
    this.boardManager.setSpatialUpdater(spatialUpdater);

    // 8. Render manager (needs camera, viewport, board, etc.)
    this.renderManager = new RenderManager(
      this.boardManager,
      this.connectionManager = null!,  // Will be set after creation
      this.selectionManager,
      this.cameraManager,
      this.viewportManager,
      this.spatialManager.cardIndex,
    );

    // 9. Card manager
    this.cardManager = new CardManager(
      this.boardManager, commandExecutor, spatialUpdater,
      this.renderManager,
    );

    // 10. Connection manager
    this.connectionManager = new ConnectionManager(
      this.boardManager, commandExecutor,
      this.renderManager,
    );

    // Re-inject connection manager into render manager
    (this.renderManager as any).connectionManager = this.connectionManager;

    // Wire render invalidator to board manager
    this.boardManager.setRenderInvalidator(this.renderManager);

    // 11. Clipboard
    this.clipboardManager = new ClipboardManager(
      this.boardManager, commandExecutor,
      () => this.selectionManager.getSelectedCardIds(),
    );

    // 12. Settings
    this.settingsManager = new SettingsManager(this.boardManager, this.boardManager);

    // 13. Storage
    this.storageManager = new StorageManager(
      this.boardManager,
      (board) => this.loadBoard(board),
      () => this.boardManager.getBoard().id,
    );

    // 14. Input
    this.inputManager = new InputManager(
      this.cameraManager,
      this.viewportManager,
      this.selectionManager,
      this.cardManager,
      this.connectionManager,
      this.historyManager,
      this.clipboardManager,
      this.boardManager,
      this.spatialManager.cardIndex,
    );

    // 15. Attach rendering to stage
    this.starter.getContainer().addChild(this.renderManager.getRoot());

    // 16. Attach input
    const screenOverlay = this.renderManager.getScreenOverlay();
    this.inputManager.attach(screenOverlay);
    this.inputManager.attachWheel(wrapper);

    // 17. Keyboard on wrapper or document
    this.inputManager.attachKeyboard(wrapper);

    // 18. Pixi ticker
    this.tickerFn = () => this.renderManager.update();
    this.starter.app.ticker.add(this.tickerFn);

    // 19. Initial resize
    this.resize();
  }
  private cardManager: CardManager;
  private connectionManager: ConnectionManager;
  private clipboardManager: ClipboardManager;
  private storageManager: StorageManager;
  private settingsManager: SettingsManager;
  private renderManager: RenderManager;
  private inputManager: InputManager;
  private destroyed = false;
resize(): void {
    this.starter.resize();
    this.viewportManager.setSize(
      this.starter.wrapper.clientWidth,
      this.starter.wrapper.clientHeight,
    );
  }

  loadBoard(board: Board): void {
    this.boardManager.loadBoard(board);
    this.historyManager.setBoard(board);
    this.cameraManager.updateState(board.camera);
    this.spatialManager.clear();
    this.boardManager.rebuildSpatial();
    this.connectionManager.rebuildLookup();
    this.renderManager.markAllDirty();
  }

  // ── Public API for React ──────────────────────────────────────────

  /** Create a demo card at the given world position */
  addDemoCard(title: string, x: number, y: number): CardId {
    return this.cardManager.createCard({
      position: { x, y },
      title,
      text: 'Double-click to edit',
      color: randomColor(),
      size: { width: 200, height: 120 },
    });
  }

  /** Connect two cards */
  connectCards(from: CardId, to: CardId): void {
    this.connectionManager.createConnection(from, to);
  }

  /** Get all card IDs */
  getCardIds(): CardId[] {
    return Object.keys(this.boardManager.getCards());
  }

  /** Get the history state */
  getHistoryState() {
    return { canUndo: this.historyManager.canUndo(), canRedo: this.historyManager.canRedo() };
  }

  /** Subscribe to selection changes */
  onSelectionChange(fn: () => void): () => void {
    return this.selectionManager.onChange(fn);
  }

  /** Subscribe to history changes */
  onHistoryChange(fn: (state: { canUndo: boolean; canRedo: boolean }) => void): () => void {
    return this.historyManager.onHistoryChanged(fn);
  }

  /** Save to localStorage */
  save(): void {
    this.storageManager.saveNow();
  }

  /** Load from localStorage if available */
  tryLoadFromStorage(): boolean {
    const board = this.storageManager.load();
    if (board) {
      this.loadBoard(board);
      return true;
    }
    return false;
  }

  /** Seed with demo data */
  seedDemoData(): void {
    const ids: CardId[] = [];
    for (let i = 0; i < 5; i++) {
      const id = this.addDemoCard(
        `Card ${i + 1}`,
        -400 + i * 200,
        -200 + Math.sin(i * 1.5) * 100,
      );
      ids.push(id);
    }
    // Connect some cards
    if (ids.length >= 3) {
      this.connectionManager.createConnection(ids[0], ids[1], { color: '#4a9eff' });
      this.connectionManager.createConnection(ids[1], ids[2], { color: '#ff6b6b' });
      this.connectionManager.createConnection(ids[2], ids[3], { color: '#51cf66' });
      this.connectionManager.createConnection(ids[3], ids[4], { color: '#ffd43b' });
    }
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;

    if (this.tickerFn) {
      this.starter.app.ticker.remove(this.tickerFn);
      this.tickerFn = null;
    }

    this.inputManager.destroy();
    this.renderManager.destroy();
    this.historyManager.dispose();
    this.starter.destroy();
  }
}

function randomColor(): string {
  const colors = ['#2d3748', '#4a5568', '#2c5282', '#285e61', '#744210', '#702459', '#1a365d'];
  return colors[Math.floor(Math.random() * colors.length)];
}