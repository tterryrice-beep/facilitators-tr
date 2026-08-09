/* eslint-disable react-hooks/refs */

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
} from "react";
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
import { COLOR_BG, DEFAULT_CARD_HEIGHT, DEFAULT_CARD_WIDTH } from "./constants";
import type { CellCoord, ViewportSize } from "./types";

type TooltipState = {
  x: number;
  y: number;
  cell: CellCoord;
  cardId: string | null;
} | null;
type EditorState = {
  cardId: string;
  coordinates: CellCoord;
  title: string;
  text: string;
  width: number;
  height: number;
} | null;

const BoardCanvas: FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef(new BoardController());
  const vpRef = useRef<ViewportSize>({ width: 0, height: 0 });
  const cardsRef = useRef<CardMap>({});
  const pointerRef = useRef({ x: 0, y: 0 });
  const dirtyRef = useRef(true);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [editor, setEditor] = useState<EditorState>(null);
  const [moveCardId, setMoveCardId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const [connectColor, setConnectColor] = useState("#ffffff");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [, refreshCards] = useState(0);

  const markDirty = useCallback(() => {
    dirtyRef.current = true;
  }, []);
  const getScreenPoint = useCallback(
    (e: { clientX: number; clientY: number }) => {
      const rect = wrapperRef.current!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    [],
  );
  const occupancy = useCallback(() => buildOccupancy(cardsRef.current), []);
  const getCardAt = useCallback(
    (cell: CellCoord): CardEntity | null => {
      const id = occupancy().get(`${cell.x}:${cell.y}`)?.cardId;
      return id ? (cardsRef.current[id] ?? null) : null;
    },
    [occupancy],
  );
  const saveCards = useCallback(() => writeCards(cardsRef.current), []);

  useEffect(() => {
    const wrapper = wrapperRef.current!;
    const canvas = document.createElement("canvas");
    const app = new Application({
      width: wrapper.clientWidth,
      height: wrapper.clientHeight,
      view: canvas,
      background: COLOR_BG,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    });
    wrapper.appendChild(canvas);
    vpRef.current = {
      width: wrapper.clientWidth,
      height: wrapper.clientHeight,
    };
    cardsRef.current = readCards();

    const grid = new GridRenderer();
    const cardRenderer = new CardRenderer();
    const connectionRenderer = new ConnectionRenderer();
    app.stage.addChild(grid.container, connectionRenderer.container, cardRenderer.container);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      controllerRef.current.zoomAt(vpRef.current, getScreenPoint(e), e.deltaY);
      setZoomPercent(Math.round(controllerRef.current.camera.zoom * 100));
      markDirty();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      wrapper.focus({ preventScroll: true });
      const point = getScreenPoint(e);
      const cell = controllerRef.current.getCellAt(vpRef.current, point);
      const clickedCard = getCardAt(cell);
      if (connectSourceId) {
        if (clickedCard && clickedCard.id !== connectSourceId) {
          const source = cardsRef.current[connectSourceId];
          if (source && !source.connects.some((connection) => connection.id === clickedCard.id)) {
            source.connects.push({ id: clickedCard.id, color: connectColor });
            clickedCard.connects.push({ id: source.id, color: connectColor });
            saveCards();
            refreshCards((v) => v + 1);
          }
          setConnectSourceId(null);
          setHoveredCardId(null);
          markDirty();
        }
        return;
      }
      if (moveCardId) {
        const card = cardsRef.current[moveCardId];
        if (
          card &&
          checkPlacement(occupancy(), cell, card.width, card.height, card.id)
            .available
        ) {
          card.coordinates = cell;
          card.cells = getCardCells(cell, card.width, card.height);
          cardsRef.current[card.id] = card;
          saveCards();
          refreshCards((v) => v + 1);
          setMoveCardId(null);
          markDirty();
        }
        return;
      }
      controllerRef.current.startDrag(vpRef.current, point);
      setIsDragging(true);
      setTooltip(null);
      markDirty();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (controllerRef.current.isDragging) {
        const p = getScreenPoint(e);
        controllerRef.current.dragMove(vpRef.current, p.x, p.y);
        markDirty();
      }
    };
    const onPointerUp = () => {
      if (controllerRef.current.isDragging) {
        controllerRef.current.endDrag();
        setIsDragging(false);
        markDirty();
      }
    };
    const onPointerMoveAny = (e: PointerEvent) => {
      pointerRef.current = getScreenPoint(e);
      onPointerMove(e);
      if (connectSourceId) {
        const hovered = getCardAt(
          controllerRef.current.getCellAt(vpRef.current, pointerRef.current),
        );
        setHoveredCardId(hovered?.id ?? null);
        markDirty();
      }
      if (moveCardId) markDirty();
    };
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const p = getScreenPoint(e);
      const cell = controllerRef.current.getCellAt(vpRef.current, p);
      setTooltip({
        x: e.clientX,
        y: e.clientY,
        cell,
        cardId: getCardAt(cell)?.id ?? null,
      });
    };
    const onDoubleClick = (e: MouseEvent) => {
      const card = getCardAt(
        controllerRef.current.getCellAt(vpRef.current, getScreenPoint(e)),
      );
      if (card)
        setEditor({
          cardId: card.id,
          coordinates: { ...card.coordinates },
          title: card.title,
          text: card.text,
          width: card.width,
          height: card.height,
        });
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (controllerRef.current.handleArrowKey(e.key)) {
        e.preventDefault();
        markDirty();
      }
    };
    const onResize = () => {
      vpRef.current = {
        width: wrapper.clientWidth,
        height: wrapper.clientHeight,
      };
      app.renderer.resize(wrapper.clientWidth, wrapper.clientHeight);
      markDirty();
    };

    wrapper.addEventListener("wheel", onWheel, { passive: false });
    wrapper.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMoveAny);
    window.addEventListener("pointerup", onPointerUp);
    wrapper.addEventListener("contextmenu", onContextMenu);
    wrapper.addEventListener("dblclick", onDoubleClick);
    wrapper.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    const tick = () => {
      if (!dirtyRef.current) return;
      dirtyRef.current = false;
      const camera = controllerRef.current.camera;
      grid.redraw(
        camera,
        vpRef.current,
        controllerRef.current.anchorCell ?? undefined,
      );
      connectionRenderer.render(
        Object.values(cardsRef.current),
        camera,
        vpRef.current,
        connectSourceId
          ? { fromId: connectSourceId, toId: hoveredCardId, color: connectColor }
          : undefined,
      );
      const moving = moveCardId ? cardsRef.current[moveCardId] : undefined;
      const preview = moving
        ? (() => {
            const cell = controllerRef.current.getCellAt(
              vpRef.current,
              pointerRef.current,
            );
            return {
              card: moving,
              coordinates: cell,
              available: checkPlacement(
                occupancy(),
                cell,
                moving.width,
                moving.height,
                moving.id,
              ).available,
            };
          })()
        : undefined;
      cardRenderer.render(
        Object.values(cardsRef.current),
        camera,
        vpRef.current,
        preview,
        connectSourceId
          ? { sourceId: connectSourceId, hoveredId: hoveredCardId }
          : undefined,
      );
    };
    app.ticker.add(tick);
    markDirty();
    return () => {
      app.ticker.remove(tick);
      wrapper.removeEventListener("wheel", onWheel);
      wrapper.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMoveAny);
      window.removeEventListener("pointerup", onPointerUp);
      wrapper.removeEventListener("contextmenu", onContextMenu);
      wrapper.removeEventListener("dblclick", onDoubleClick);
      wrapper.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      grid.destroy();
      connectionRenderer.destroy();
      cardRenderer.destroy();
      app.destroy(true, { children: true, texture: true });
    };
  }, [
    getCardAt,
    getScreenPoint,
    markDirty,
    moveCardId,
    connectColor,
    connectSourceId,
    hoveredCardId,
    occupancy,
    refreshCards,
    saveCards,
  ]);

  const startCreate = () => {
    if (!tooltip) return;
    const id = String(Date.now());
    const card: CardEntity = {
      id,
      title: "",
      text: "",
      connects: [],
      coordinates: tooltip.cell,
      width: DEFAULT_CARD_WIDTH,
      height: DEFAULT_CARD_HEIGHT,
      cells: getCardCells(
        tooltip.cell,
        DEFAULT_CARD_WIDTH,
        DEFAULT_CARD_HEIGHT,
      ),
    };
    cardsRef.current[id] = card;
    setEditor({
      cardId: id,
      coordinates: { ...card.coordinates },
      title: "",
      text: "",
      width: DEFAULT_CARD_WIDTH,
      height: DEFAULT_CARD_HEIGHT,
    });
    setTooltip(null);
    markDirty();
  };
  const saveEditor = () => {
    if (!editor) return;
    const card = cardsRef.current[editor.cardId];
    if (!card) return;
    const width = Math.max(1, editor.width);
    const height = Math.max(1, editor.height);
    const free = checkPlacement(
      occupancy(),
      editor.coordinates,
      width,
      height,
      card.id,
    ).available;
    const coordinates = free
      ? editor.coordinates
      : findNearestFreePosition(
          occupancy(),
          editor.coordinates,
          width,
          height,
          card.id,
        );
    card.title = editor.title;
    card.text = editor.text;
    card.width = width;
    card.height = height;
    card.coordinates = coordinates;
    card.cells = getCardCells(coordinates, width, height);
    cardsRef.current[card.id] = card;
    saveCards();
    refreshCards((v) => v + 1);
    setEditor(null);
    markDirty();
  };
  const removeCard = () => {
    if (!deleteId) return;
    delete cardsRef.current[deleteId];
    saveCards();
    refreshCards((v) => v + 1);
    setDeleteId(null);
    setTooltip(null);
    markDirty();
  };
  const editorCard = editor ? cardsRef.current[editor.cardId] : null;
  const editorPlacement = editor
    ? checkPlacement(
        occupancy(),
        editor.coordinates,
        editor.width,
        editor.height,
        editor.cardId,
      )
    : null;

  return (
    <>
      <div className="cardboardZoom">Zoom: {zoomPercent}%</div>
      <div
        ref={wrapperRef}
        className="cardboardCanvas"
        tabIndex={0}
        autoFocus
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      />
      {moveCardId && (
        <div className="cardboardMoveHint">
          Move mode: choose a green position and click
        </div>
      )}
      {connectSourceId && (
        <div className="cardboardConnectPanel">
          <label>
            Thread color
            <input type="color" value={connectColor} onChange={(e) => { setConnectColor(e.target.value); markDirty(); }} />
          </label>
          <button onClick={() => { setConnectSourceId(null); setHoveredCardId(null); markDirty(); }}>Cancel</button>
        </div>
      )}
      {tooltip && (
        <div
          className="cardboardTooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
          onClick={(e) => e.stopPropagation()}>
          {!tooltip.cardId ? (
            <button onClick={startCreate}>Add Card</button>
          ) : (
            <>
              <button
                onClick={() => {
                  setDeleteId(tooltip.cardId);
                  setTooltip(null);
                }}>
                Remove Card
              </button>
              <button
                onClick={() => {
                  setMoveCardId(tooltip.cardId);
                  setTooltip(null);
                  markDirty();
                }}>
                Move Card
              </button>
              <button
                onClick={() => {
                  setConnectSourceId(tooltip.cardId);
                  setHoveredCardId(null);
                  setTooltip(null);
                  markDirty();
                }}>
                Connect
              </button>
              <button
                onClick={() => {
                  const card = cardsRef.current[tooltip.cardId!];
                  if (card)
                    setEditor({
                      cardId: card.id,
                      coordinates: { ...card.coordinates },
                      title: card.title,
                      text: card.text,
                      width: card.width,
                      height: card.height,
                    });
                  setTooltip(null);
                }}>
                Open Card
              </button>
            </>
          )}
        </div>
      )}
      {editor && (
        <div className="cardboardModalOverlay">
          <div className="cardboardModal">
            <h3>{editorCard?.title ? "Edit Card" : "New Card"}</h3>
            <label>
              Title
              <input
                value={editor.title}
                onChange={(e) =>
                  setEditor({ ...editor, title: e.target.value })
                }
              />
            </label>
            <label>
              Text
              <textarea
                value={editor.text}
                onChange={(e) => setEditor({ ...editor, text: e.target.value })}
              />
            </label>
            <div className="cardboardFields">
              <label>
                Width
                <input
                  type="number"
                  min={1}
                  value={editor.width}
                  onChange={(e) =>
                    setEditor({ ...editor, width: Number(e.target.value) || 1 })
                  }
                />
              </label>
              <label>
                Height
                <input
                  type="number"
                  min={1}
                  value={editor.height}
                  onChange={(e) =>
                    setEditor({
                      ...editor,
                      height: Number(e.target.value) || 1,
                    })
                  }
                />
              </label>
            </div>
            {editorPlacement && !editorPlacement.available && (
              <p className="cardboardWarning">
                The card will be moved to the nearest free space.
              </p>
            )}
            <div className="cardboardActions">
              <button onClick={() => setEditor(null)}>Cancel</button>
              <button onClick={saveEditor}>Save</button>
            </div>
          </div>
        </div>
      )}
      {deleteId && (
        <div className="cardboardModalOverlay">
          <div className="cardboardModal">
            <h3>Remove Card</h3>
            <p>
              Remove “{(cardsRef.current || {}) [deleteId]?.title || "Untitled card"}”?
            </p>
            <div className="cardboardActions">
              <button onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="danger" onClick={removeCard}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BoardCanvas;
