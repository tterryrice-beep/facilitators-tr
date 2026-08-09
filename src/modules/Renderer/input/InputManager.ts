import type { Container } from 'pixi.js';
import type { CameraManager } from '../camera/CameraManager';
import type { ViewportManager } from '../viewport/ViewportManager';
import type { SelectionManager } from '../managers/SelectionManager';
import type { CardManager } from '../managers/CardManager';
import type { ConnectionManager } from '../managers/ConnectionManager';
import type { HistoryManager } from '../managers/HistoryManager';
import type { ClipboardManager } from '../managers/ClipboardManager';
import type { BoardManager } from '../managers/BoardManager';
import type { SpatialIndex } from '../spatial';
import type { CardId } from '../types';
import { createEmptyInputState, type InputState } from './InputState';
import { SelectTool } from './tools/SelectTool';
import { PanTool } from './tools/PanTool';
import { ConnectCardsTool } from './tools/ConnectCardsTool';
import type { BaseTool } from './tools/BaseTool';

export class InputManager {
  private state: InputState = createEmptyInputState();
  private selectTool: SelectTool;
  private panTool: PanTool;
  private connectTool: ConnectCardsTool;
  private activeTool: BaseTool;
  private panKeyHeld = false;
  private destroyed = false;

  constructor(
    private cameraManager: CameraManager,
    private viewportManager: ViewportManager,
    private selectionManager: SelectionManager,
    private cardManager: CardManager,
    private connectionManager: ConnectionManager,
    private historyManager: HistoryManager,
    private clipboardManager: ClipboardManager,
    private boardManager: BoardManager,
    private spatialIndex: SpatialIndex<CardId>,
  ) {
    this.selectTool = new SelectTool(cameraManager, viewportManager, selectionManager, cardManager, connectionManager, historyManager, boardManager, spatialIndex);
    this.panTool = new PanTool(cameraManager, viewportManager);
    this.connectTool = new ConnectCardsTool(selectionManager, connectionManager, historyManager);
    this.activeTool = this.selectTool;
  }

  getState(): InputState { return this.state; }
  getActiveTool(): BaseTool { return this.activeTool; }

  attach(container: Container): void {
    container.eventMode = 'static';
    container.cursor = 'default';
    container.on('pointerdown', this.onPointerDown.bind(this));
    container.on('pointermove', this.onPointerMove.bind(this));
    container.on('pointerup', this.onPointerUp.bind(this));
    container.on('pointerupoutside', this.onPointerUp.bind(this));
  }

  attachWheel(element: HTMLElement): void {
    element.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
  }

  attachKeyboard(element: HTMLElement): void {
    element.addEventListener('keydown', this.onKeyDownWrapper.bind(this));
    element.addEventListener('keyup', this.onKeyUpWrapper.bind(this));
    if (element.tabIndex < 0) element.tabIndex = 0;
  }
private updateWorldPosition(): void {
    this.state.worldPosition = this.cameraManager.screenToWorld(this.state.screenPosition);
    const candidates = this.spatialIndex.queryPoint(this.state.worldPosition);
    this.state.hoveredCardId = (candidates.length > 0 ? candidates[candidates.length - 1] : null) as CardId | null;
  }

  private onPointerDown(e: any): void {
    const pos = e.getLocalPosition(e.currentTarget);
    this.state.screenPosition = { x: pos.x, y: pos.y };
    this.state.pressedButtons.add(e.button ?? 0);
    this.state.dragStart = { ...this.state.screenPosition };
    this.updateWorldPosition();
    if (this.panKeyHeld || e.button === 1) this.activeTool = this.panTool;
    this.activeTool.onPointerDown(this.state);
  }

  private onPointerMove(e: any): void {
    const pos = e.getLocalPosition(e.currentTarget);
    this.state.screenPosition = { x: pos.x, y: pos.y };
    this.updateWorldPosition();
    if (this.state.dragStart) {
      this.state.dragDelta = {
        x: this.state.screenPosition.x - this.state.dragStart.x,
        y: this.state.screenPosition.y - this.state.dragStart.y,
      };
      if (Math.abs(this.state.dragDelta.x) > 3 || Math.abs(this.state.dragDelta.y) > 3) {
        this.state.isDragging = true;
      }
    }
    this.activeTool.onPointerMove(this.state);
  }

  private onPointerUp(_e: any): void {
    this.state.pressedButtons.clear();
    this.state.dragStart = null;
    this.state.isDragging = false;
    this.activeTool.onPointerUp(this.state);
    if (this.activeTool === this.panTool && !this.panKeyHeld) {
      this.activeTool = this.selectTool;
    }
  }

  private onWheel(e: WheelEvent): void {
    e.preventDefault();
    this.state.worldPosition = this.cameraManager.screenToWorld(this.state.screenPosition);
    this.activeTool.onWheel(this.state, e.deltaY);
  }

  private onKeyDownWrapper(e: KeyboardEvent): void {
    if (e.key === ' ') { this.panKeyHeld = true; e.preventDefault(); return; }
    this.state.modifierKeys.ctrl = e.ctrlKey || e.metaKey;
    this.state.modifierKeys.shift = e.shiftKey;
    this.state.modifierKeys.alt = e.altKey;
    this.state.modifierKeys.meta = e.metaKey;
    this.activeTool.onKeyDown(e.key, this.state);

    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault(); this.historyManager.undo();
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault(); this.historyManager.redo();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      e.preventDefault(); this.clipboardManager.copySelectedCards();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      e.preventDefault(); this.clipboardManager.pasteCardsAtScreen(this.state.worldPosition);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault(); this.clipboardManager.duplicateSelected();
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      const sel = this.selectionManager.getSelectedCardIds();
      if (sel.length > 0) this.cardManager.deleteCards(sel);
    } else if (e.key === '0') {
      this.fitBoard();
    } else if (e.key === 'Escape') {
      this.selectionManager.clearSelection();
    }
  }

  private onKeyUpWrapper(e: KeyboardEvent): void {
    if (e.key === ' ') { this.panKeyHeld = false; }
    this.state.modifierKeys.ctrl = e.ctrlKey || e.metaKey;
    this.state.modifierKeys.shift = e.shiftKey;
    this.activeTool.onKeyUp(e.key, this.state);
  }

  private fitBoard(): void {
    this.cameraManager.fitBounds(
      { x: -500, y: -500, width: 1000, height: 1000 },
      window.innerWidth, window.innerHeight,
    );
  }

  destroy(): void {
    this.destroyed = true;
    this.selectTool.deactivate();
    this.panTool.deactivate();
    this.connectTool.deactivate();
  }
}