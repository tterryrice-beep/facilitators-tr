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
    this.tickerFn = () => {
      // Sync connect preview from input manager
      const preview = this.inputManager.connectTool.getPreview();
      if (preview) {
        this.renderManager.connectPreviewSource = preview.cardId;
        this.renderManager.connectPreviewPoint = preview.point;
      } else if (!this.inputManager.connectTool.isConnecting) {
        this.renderManager.hideConnectPreview();
      }
      this.renderManager.update();
    };
    this.starter.app.ticker.add(this.tickerFn);

    // 19. Initial resize
    this.resize();
  }

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

  /** Get card at screen position (returns card ID or null) */
  getCardAtScreen(screenX: number, screenY: number): CardId | null {
    const world = this.cameraManager.screenToWorld({ x: screenX, y: screenY });
    const candidates = this.spatialManager.cardIndex.queryPoint(world);
    return (candidates.length > 0 ? candidates[candidates.length - 1] : null) as CardId | null;
  }

  /** Get card by id */
  getCard(id: CardId) { return this.boardManager.getCard(id); }

  /** Get card at world point */
  getCardAtWorld(wx: number, wy: number): CardId | null {
    const candidates = this.spatialManager.cardIndex.queryPoint({ x: wx, y: wy });
    return (candidates.length > 0 ? candidates[candidates.length - 1] : null) as CardId | null;
  }

  /** Create a card at given world position with specified size */
  createCard(opts: { title: string; text: string; x: number; y: number; width: number; height: number }): CardId {
    return this.cardManager.createCard({
      position: { x: opts.x, y: opts.y },
      title: opts.title,
      text: opts.text,
      color: randomColor(),
      size: { width: opts.width, height: opts.height },
    });
  }

  /** Update card content and size */
  updateCard(id: CardId, title: string, text: string, width: number, height: number): void {
    const card = this.boardManager.getCard(id);
    if (!card) return;
    card.title = title;
    card.text = text;
    card.size = { width, height };
    card.updatedAt = Date.now();
    this.boardManager.markCardsDirty([id]);
    this.spatialManager.updateCardSpatial(id, {
      minX: card.position.x, minY: card.position.y,
      maxX: card.position.x + width, maxY: card.position.y + height,
    });
    this.connectionManager.markConnectionsDirtyForCard(id);
  }

  /** Delete a card and its connections */
  deleteCard(id: CardId): void {
    this.cardManager.deleteCards([id]);
    this.selectionManager.deleteSelectedFromState([id]);
    this.renderManager.hideConnectPreview();
  }

  /** Remove all connections from a card */
  disconnectCard(id: CardId): void {
    const connIds = this.connectionManager.getConnectionsForCard(id);
    if (connIds.length > 0) this.connectionManager.deleteConnections(connIds);
  }

  /** Start connect mode from given card */
  startConnectMode(cardId: CardId): void {
    this.renderManager.showConnectPreview(cardId);
    this.inputManager.switchToConnect(cardId);
  }

  cancelConnectMode(): void {
    this.renderManager.hideConnectPreview();
    this.inputManager.cancelConnect();
  }

  isConnectActive(): boolean { return this.inputManager.connectTool.isConnecting; }

  /** Context menu callback */
  onContextMenu(fn: (screenX: number, screenY: number, worldX: number, worldY: number, cardId: CardId | null) => void): void {
    this.inputManager.onContextMenu = fn;
  }

  /** Get board settings */
  getBoardSettings() { return this.boardManager.getSettings(); }

  /** Update board settings */
  updateSettings(partial: Partial<import('../types').BoardSettings>): void {
    const s = { ...this.boardManager.getSettings(), ...partial };
    if (partial.rendering?.backgroundColor) {
      this.starter.app.renderer.background.color = partial.rendering.backgroundColor;
    }
    this.boardManager.setSettings(s);
    this.renderManager.markAllDirty();
  }

  /** Set background color */
  setBackgroundColor(color: string): void {
    this.starter.app.renderer.background.color = color;
    const s = this.boardManager.getSettings();
    s.rendering.backgroundColor = color;
    this.boardManager.setSettings(s);
  }

  /** Toggle grid */
  setGridEnabled(enabled: boolean): void {
    const s = this.boardManager.getSettings();
    s.grid.enabled = enabled;
    this.boardManager.setSettings(s);
    this.renderManager.markAllDirty();
  }

  /** Set grid color */
  setGridColor(color: string): void {
    const s = this.boardManager.getSettings();
    s.grid.color = color;
    this.boardManager.setSettings(s);
    this.renderManager.markAllDirty();
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
      const id = this.createCard({
        title: `Card ${i + 1}`, text: 'Double-click to edit',
        x: -400 + i * 200, y: -200 + Math.sin(i * 1.5) * 100,
        width: 200, height: 120,
      });
      ids.push(id);
    }
    if (ids.length >= 3) {
      this.connectionManager.createConnection(ids[0], ids[1], { color: '#4a9eff' });
      this.connectionManager.createConnection(ids[1], ids[2], { color: '#ff6b6b' });
      this.connectionManager.createConnection(ids[2], ids[3], { color: '#51cf66' });
      this.connectionManager.createConnection(ids[3], ids[4], { color: '#ffd43b' });
    }
  }

  getHistoryState() {
    return { canUndo: this.historyManager.canUndo(), canRedo: this.historyManager.canRedo() };
  }

  onSelectionChange(fn: () => void): () => void { return this.selectionManager.onChange(fn); }
  onHistoryChange(fn: (state: { canUndo: boolean; canRedo: boolean }) => void): () => void {
    return this.historyManager.onHistoryChanged(fn);
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