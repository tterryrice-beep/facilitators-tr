import { Application } from "pixi.js";
import { BoardController } from "./BoardController";
import { CardRenderer } from "./CardRenderer";
import { ConnectionRenderer } from "./ConnectionRenderer";
import {
  buildOccupancy,
  checkPlacement,
  findNearestFreePosition,
  getCardCells,
  readCards,
  writeCards,
  type CardEntity,
  type CardMap,
} from "./cardTypes";
import { GridRenderer } from "./GridRenderer";
import {
  COLOR_BG,
  DEFAULT_CARD_BACKGROUND,
  DEFAULT_COLORS_LIST,
} from "./constants";
import type { CellCoord, ViewportSize } from "./types";

export interface CardBoardAppCallbacks {
  initialCards?: CardMap;
  onCardsChange?: (cards: CardMap) => void;
  onZoomChange?: (zoomPercent: number) => void;
  onPointerStateChange?: (dragging: boolean) => void;
  onContextMenu?: (event: {
    x: number;
    y: number;
    cell: CellCoord;
    cardId: string | null;
  }) => void;
  onOpenCard?: (card: CardEntity) => void;
  onEditorChange?: (card: CardEntity) => void;
  onDeleteRequest?: (card: CardEntity) => void;
  onColorHistoryChange?: (colors: string[]) => void;
}

export class CardBoardApp {
  private readonly app: Application;
  private readonly controller = new BoardController();
  private readonly cards: CardMap;
  private readonly occupancy = new Map<string, { cardId: string | null }>();
  private readonly grid: GridRenderer;
  private readonly cardRenderer: CardRenderer;
  private readonly connectionRenderer: ConnectionRenderer;
  private readonly viewport: ViewportSize;
  private readonly callbacks: CardBoardAppCallbacks;
  private readonly pointer = { x: 0, y: 0 };
  private readonly activeTouches = new Map<number, { x: number; y: number }>();
  private pinchDistance: number | null = null;
  private moveCardId: string | null = null;
  private connectSourceId: string | null = null;
  private disconnectSourceId: string | null = null;
  private connectColor = "#ffffff";
  private hoveredCardId: string | null = null;
  private dirty = true;
  private cardsDirty = true;
  private destroyed = false;
  private readonly wrapper: HTMLElement;
  private readonly defaultColorHistory = [...DEFAULT_COLORS_LIST];
  private colorHistory = [...this.defaultColorHistory];

  constructor(wrapper: HTMLElement, callbacks: CardBoardAppCallbacks = {}) {
    this.wrapper = wrapper;
    this.callbacks = callbacks;
    const canvas = document.createElement("canvas");
    this.app = new Application({
      width: wrapper.clientWidth,
      height: wrapper.clientHeight,
      view: canvas,
      background: COLOR_BG,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    });
    wrapper.appendChild(canvas);
    this.viewport = {
      width: wrapper.clientWidth,
      height: wrapper.clientHeight,
    };
    this.cards = callbacks.initialCards ?? readCards();
    this.rebuildOccupancy();
    this.grid = new GridRenderer();
    this.cardRenderer = new CardRenderer();
    this.connectionRenderer = new ConnectionRenderer();
    this.app.stage.addChild(
      this.grid.container,
      this.connectionRenderer.container,
      this.cardRenderer.container,
    );
    this.bindEvents();
    this.app.ticker.add(this.tick);
  }

  setMoveMode(cardId: string | null): void {
    this.moveCardId = cardId;
    this.markDirty();
  }
  setConnectMode(cardId: string | null, color = this.connectColor): void {
    this.connectSourceId = cardId;
    this.disconnectSourceId = null;
    this.connectColor = color;
    this.hoveredCardId = null;
    this.markDirty();
  }
  setDisconnectMode(cardId: string | null): void {
    this.disconnectSourceId = cardId;
    this.connectSourceId = null;
    this.hoveredCardId = null;
    this.markDirty();
  }
  setConnectColor(color: string): void {
    this.connectColor = color;
  }
  getColorHistory(): string[] {
    return [...this.colorHistory];
  }
  addColorToHistory(color: string): string[] {
    this.colorHistory = [
      color,
      ...this.colorHistory.filter((item) => item !== color),
    ].slice(0, 10);
    const history = this.getColorHistory();
    this.callbacks.onColorHistoryChange?.(history);
    return history;
  }
  clearColorHistory(): string[] {
    this.colorHistory = [];
    this.callbacks.onColorHistoryChange?.([]);
    return [];
  }
  getCard(id: string): CardEntity | undefined {
    return this.cards[id];
  }
  getCards(): CardMap {
    return this.cards;
  }

  createCard(cell: CellCoord, width: number, height: number): CardEntity {
    const id = String(Date.now());
    const card: CardEntity = {
      id,
      updatedAt: Date.now(),
      title: "",
      text: "",
      background: DEFAULT_CARD_BACKGROUND,
      connects: [],
      coordinates: cell,
      width,
      height,
      cells: getCardCells(cell, width, height),
    };
    this.cards[id] = card;
    this.rebuildOccupancy();
    this.markDirty();
    return card;
  }

  save(): void {
    writeCards(this.cards);
    this.callbacks.onCardsChange?.(this.cards);
  }

  updateCard(
    cardId: string,
    data: Pick<
      CardEntity,
      "title" | "text" | "background" | "coordinates" | "width" | "height"
    >,
  ): CardEntity | null {
    const card = this.cards[cardId];
    if (!card) return null;
    const position = checkPlacement(
      this.occupancy,
      data.coordinates,
      data.width,
      data.height,
      card.id,
    ).available
      ? data.coordinates
      : findNearestFreePosition(
          this.occupancy,
          data.coordinates,
          data.width,
          data.height,
          card.id,
        );
    Object.assign(card, data, {
      updatedAt: Date.now(),
      background: isValidColor(data.background)
        ? data.background
        : DEFAULT_CARD_BACKGROUND,
      coordinates: position,
      cells: getCardCells(position, data.width, data.height),
    });
    this.rebuildOccupancy();
    this.save();
    this.cardsDirty = true;
    this.markDirty();
    return card;
  }

  deleteCard(cardId: string): void {
    const card = this.cards[cardId];
    if (!card) return;
    for (const other of Object.values(this.cards))
      other.connects = other.connects.filter(
        (connection) => connection.id !== cardId,
      );
    delete this.cards[cardId];
    this.touchCards();
    this.rebuildOccupancy();
    this.save();
    this.markDirty();
  }

  private bindEvents(): void {
    this.wrapper.addEventListener("wheel", this.onWheel, { passive: false });
    this.wrapper.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    this.wrapper.addEventListener("contextmenu", this.onContextMenu);
    this.wrapper.addEventListener("dblclick", this.onDoubleClick);
    this.wrapper.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("resize", this.onResize);
  }

  private onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    this.controller.zoomAt(
      this.viewport,
      this.screenPoint(event),
      -event.deltaY,
    );
    this.callbacks.onZoomChange?.(
      Math.round(this.controller.camera.zoom * 100),
    );
    this.markDirty();
  };
  private onPointerDown = (event: PointerEvent): void => {
    if (event.pointerType === "touch") {
      this.activeTouches.set(event.pointerId, this.screenPoint(event));
      if (this.activeTouches.size === 2) {
        this.controller.endDrag();
        this.pinchDistance = this.getTouchDistance();
        event.preventDefault();
      }
      return;
    }
    if (event.button !== 0) return;
    this.wrapper.focus({ preventScroll: true });
    const point = this.screenPoint(event);
    const cell = this.controller.getCellAt(this.viewport, point);
    const card = this.getCardAt(cell);
    if (this.disconnectSourceId) {
      if (card?.id === this.disconnectSourceId) return this.cancelModes();
      if (card) this.disconnect(card);
      return;
    }
    if (this.connectSourceId) {
      if (card?.id === this.connectSourceId) return this.cancelModes();
      if (card) this.connect(card);
      return;
    }
    if (this.moveCardId) {
      if (card && card.id === this.moveCardId) return;
      const moving = this.cards[this.moveCardId];
      if (
        moving &&
        checkPlacement(
          this.occupancy,
          cell,
          moving.width,
          moving.height,
          moving.id,
        ).available
      ) {
        this.moveCard(moving, cell);
      }
      return;
    }
    this.controller.startDrag(this.viewport, point);
    this.callbacks.onPointerStateChange?.(true);
    this.markDirty();
  };
  private onPointerMove = (event: PointerEvent): void => {
    if (event.pointerType === "touch") {
      if (!this.activeTouches.has(event.pointerId)) return;
      this.activeTouches.set(event.pointerId, this.screenPoint(event));
      if (this.activeTouches.size === 2) {
        const nextDistance = this.getTouchDistance();
        if (this.pinchDistance !== null && nextDistance > 0) {
          const midpoint = this.getTouchMidpoint();
          const delta = nextDistance - this.pinchDistance;
          this.controller.zoomAt(this.viewport, midpoint, -delta);
          this.callbacks.onZoomChange?.(
            Math.round(this.controller.camera.zoom * 100),
          );
          this.markDirty();
        }
        this.pinchDistance = nextDistance;
        event.preventDefault();
      }
      return;
    }
    this.pointer.x = this.screenPoint(event).x;
    this.pointer.y = this.screenPoint(event).y;
    if (this.controller.isDragging)
      this.controller.dragMove(this.viewport, this.pointer.x, this.pointer.y);
    if (this.connectSourceId || this.disconnectSourceId)
      this.hoveredCardId =
        this.getCardAt(this.controller.getCellAt(this.viewport, this.pointer))
          ?.id ?? null;
    this.markDirty();
  };
  private onPointerUp = (event: PointerEvent): void => {
    if (event.pointerType === "touch") {
      this.activeTouches.delete(event.pointerId);
      if (this.activeTouches.size < 2) this.pinchDistance = null;
      return;
    }
    if (this.controller.isDragging) {
      this.controller.endDrag();
      this.callbacks.onPointerStateChange?.(false);
      this.markDirty();
    }
  };
  private onContextMenu = (event: MouseEvent): void => {
    event.preventDefault();
    const cell = this.controller.getCellAt(
      this.viewport,
      this.screenPoint(event),
    );
    this.callbacks.onContextMenu?.({
      x: event.clientX,
      y: event.clientY,
      cell,
      cardId: this.getCardAt(cell)?.id ?? null,
    });
  };
  private onDoubleClick = (event: MouseEvent): void => {
    const card = this.getCardAt(
      this.controller.getCellAt(this.viewport, this.screenPoint(event)),
    );
    if (card) this.callbacks.onOpenCard?.(card);
  };
  private onKeyDown = (event: KeyboardEvent): void => {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    )
      return;
    if (
      event.key === "Escape" &&
      (this.connectSourceId || this.disconnectSourceId || this.moveCardId)
    )
      return this.cancelModes();
    if (this.controller.handleArrowKey(event.key)) {
      event.preventDefault();
      this.markDirty();
    }
  };
  private onResize = (): void => {
    this.viewport.width = this.wrapper.clientWidth;
    this.viewport.height = this.wrapper.clientHeight;
    this.app.renderer.resize(this.viewport.width, this.viewport.height);
    this.markDirty();
  };

  private connect(target: CardEntity): void {
    const source = this.cards[this.connectSourceId!];
    if (
      !source ||
      source.connects.some((connection) => connection.id === target.id)
    )
      return;
    source.connects.push({ id: target.id, color: this.connectColor });
    target.connects.push({ id: source.id, color: this.connectColor });
    this.save();
    this.cancelModes();
  }
  private disconnect(target: CardEntity): void {
    const source = this.cards[this.disconnectSourceId!];
    if (!source) return;
    source.connects = source.connects.filter(
      (connection) => connection.id !== target.id,
    );
    target.connects = target.connects.filter(
      (connection) => connection.id !== source.id,
    );
    this.save();
    this.cancelModes();
  }
  private moveCard(card: CardEntity, cell: CellCoord): void {
    card.coordinates = cell;
    card.cells = getCardCells(cell, card.width, card.height);
    this.touchCards();
    this.rebuildOccupancy();
    this.save();
    this.moveCardId = null;
    this.markDirty();
  }
  private cancelModes(): void {
    this.moveCardId = null;
    this.connectSourceId = null;
    this.disconnectSourceId = null;
    this.hoveredCardId = null;
    this.markDirty();
  }
  private touchCards(): void {
    const updatedAt = Date.now();
    for (const card of Object.values(this.cards)) card.updatedAt = updatedAt;
  }
  private getCardAt(cell: CellCoord): CardEntity | null {
    const id = this.occupancy.get(`${cell.x}:${cell.y}`)?.cardId;
    return id ? (this.cards[id] ?? null) : null;
  }
  private rebuildOccupancy(): void {
    this.occupancy.clear();
    const next = buildOccupancy(this.cards);
    for (const [key, value] of next) this.occupancy.set(key, value);
  }
  private screenPoint(event: { clientX: number; clientY: number }): {
    x: number;
    y: number;
  } {
    const rect = this.wrapper.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }
  private getTouchDistance(): number {
    const points = [...this.activeTouches.values()];
    return Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
  }
  private getTouchMidpoint(): { x: number; y: number } {
    const points = [...this.activeTouches.values()];
    return {
      x: (points[0].x + points[1].x) / 2,
      y: (points[0].y + points[1].y) / 2,
    };
  }
  private markDirty(): void {
    this.dirty = true;
  }
  private tick = (): void => {
    if (!this.dirty || this.destroyed) return;
    this.dirty = false;
    const camera = this.controller.camera;
    this.grid.redraw(
      camera,
      this.viewport,
      this.controller.anchorCell ?? undefined,
    );
    const moving = this.moveCardId ? this.cards[this.moveCardId] : undefined;
    const preview = moving
      ? {
          card: moving,
          coordinates: this.controller.getCellAt(this.viewport, this.pointer),
          available: checkPlacement(
            this.occupancy,
            this.controller.getCellAt(this.viewport, this.pointer),
            moving.width,
            moving.height,
            moving.id,
          ).available,
        }
      : undefined;
    this.connectionRenderer.render(
      Object.values(this.cards),
      camera,
      this.viewport,
      this.connectSourceId
        ? {
            fromId: this.connectSourceId,
            toId: this.hoveredCardId,
            color: this.connectColor,
            dashed: true,
          }
        : undefined,
    );
    this.cardRenderer.render(
      Object.values(this.cards),
      camera,
      this.viewport,
      preview,
    );
    this.cardsDirty = false;
  };

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.app.ticker.remove(this.tick);
    this.wrapper.removeEventListener("wheel", this.onWheel);
    this.wrapper.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    this.wrapper.removeEventListener("contextmenu", this.onContextMenu);
    this.wrapper.removeEventListener("dblclick", this.onDoubleClick);
    this.wrapper.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("resize", this.onResize);
    this.grid.destroy();
    this.connectionRenderer.destroy();
    this.cardRenderer.destroy();
    this.app.destroy(true, { children: true, texture: true });
  }
}

function isValidColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}
