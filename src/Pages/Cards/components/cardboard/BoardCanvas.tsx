import React, { useEffect, useRef, useState, type FC } from "react";
import { CardBoardApp } from "./CardBoardApp";
import type { CardEntity } from "./cardTypes";
import { DEFAULT_CARD_HEIGHT, DEFAULT_CARD_WIDTH } from "./constants";
import type { CellCoord } from "./types";

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
  background: string;
  width: number;
  height: number;
} | null;

const BoardCanvas: FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<CardBoardApp | null>(null);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [dragging, setDragging] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [editor, setEditor] = useState<EditorState>(null);
  const [deleteCard, setDeleteCard] = useState<CardEntity | null>(null);
  const [moveCardId, setMoveCardId] = useState<string | null>(null);
  const [connectMode, setConnectMode] = useState<string | null>(null);
  const [disconnectMode, setDisconnectMode] = useState<string | null>(null);
  const [connectColor, setConnectColor] = useState("#ffffff");
  const [pendingColor, setPendingColor] = useState("#ffffff");
  const [colorHistory, setColorHistory] = useState<string[]>([]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const app = new CardBoardApp(wrapperRef.current, {
      onZoomChange: setZoomPercent,
      onPointerStateChange: setDragging,
      onContextMenu: setTooltip,
      onColorHistoryChange: setColorHistory,
      onOpenCard: (card) =>
        setEditor({
          cardId: card.id,
          coordinates: { ...card.coordinates },
          title: card.title,
          text: card.text,
          background: card.background,
          width: card.width,
          height: card.height,
        }),
    });
    appRef.current = app;
    setColorHistory(app.getColorHistory());
    return () => {
      app.destroy();
      appRef.current = null;
    };
  }, []);

  const startCreate = () => {
    if (!tooltip || !appRef.current) return;
    const card = appRef.current.createCard(
      tooltip.cell,
      DEFAULT_CARD_WIDTH,
      DEFAULT_CARD_HEIGHT,
    );
    setEditor({
      cardId: card.id,
      coordinates: { ...card.coordinates },
      title: "",
      text: "",
      background: card.background,
      width: DEFAULT_CARD_WIDTH,
      height: DEFAULT_CARD_HEIGHT,
    });
    setTooltip(null);
  };
  const openCard = (card: CardEntity) => {
    setEditor({
      cardId: card.id,
      coordinates: { ...card.coordinates },
      title: card.title,
      text: card.text,
      background: card.background,
      width: card.width,
      height: card.height,
    });
    setTooltip(null);
  };
  const saveEditor = () => {
    if (!editor || !appRef.current) return;
    appRef.current.updateCard(editor.cardId, editor);
    setEditor(null);
  };
  const confirmDelete = () => {
    if (deleteCard && appRef.current) appRef.current.deleteCard(deleteCard.id);
    setDeleteCard(null);
  };
  const cancelMode = () => {
    setConnectMode(null);
    setDisconnectMode(null);
    setMoveCardId(null);
    appRef.current?.setMoveMode(null);
    appRef.current?.setConnectMode(null);
    appRef.current?.setDisconnectMode(null);
  };
  const startConnect = (id: string) => {
    setConnectMode(id);
    setDisconnectMode(null);
    setPendingColor(connectColor);
    setTooltip(null);
    appRef.current?.setConnectMode(id, connectColor);
  };
  const startDisconnect = (card: CardEntity) => {
    setTooltip(null);
    if (card.connects.length === 1) {
      const target = appRef.current?.getCard(card.connects[0].id);
      if (target) {
        card.connects = card.connects.filter(
          (connection) => connection.id !== target.id,
        );
        target.connects = target.connects.filter(
          (connection) => connection.id !== card.id,
        );
        appRef.current?.save();
      }
      return;
    }
    setDisconnectMode(card.id);
    setConnectMode(null);
    appRef.current?.setDisconnectMode(card.id);
  };
  const tooltipCard = tooltip?.cardId
    ? appRef.current?.getCard(tooltip.cardId)
    : null;
  const activeMode = connectMode || disconnectMode;

  return (
    <>
      <div className="cardboardZoom">Zoom: {zoomPercent}%</div>
      <div
        ref={wrapperRef}
        className="cardboardCanvas"
        tabIndex={0}
        autoFocus
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      />
      {moveCardId && (
        <div className="cardboardMoveHint">
          Move mode: choose a green position and click
        </div>
      )}
      {activeMode && (
        <div className="cardboardConnectPanel">
          {connectMode && (
            <>
              <label>
                Thread color{" "}
                <input
                  type="color"
                  value={pendingColor}
                  onChange={(e) => setPendingColor(e.target.value)}
                />
              </label>
              <button
                onClick={() => {
                  setConnectColor(pendingColor);
                  appRef.current?.addColorToHistory(pendingColor);
                  appRef.current?.setConnectColor(pendingColor);
                }}>
                OK
              </button>
              <div className="cardboardColorHistory">
                {colorHistory.map((color) => <button key={color} title={color} style={{ backgroundColor: color }} onClick={() => setPendingColor(color)} />)}
              </div>
              <button onClick={() => { appRef.current?.clearColorHistory(); setColorHistory([]); }}>Clear history</button>
            </>
          )}
          <button onClick={cancelMode}>Cancel</button>
        </div>
      )}
      {tooltip && (
        <div
          className="cardboardTooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
          onClick={(e) => e.stopPropagation()}>
          {!tooltipCard ? (
            <button onClick={startCreate}>Add Card</button>
          ) : (
            <>
              <button
                onClick={() => {
                  setDeleteCard(tooltipCard);
                  setTooltip(null);
                }}>
                Remove Card
              </button>
              <button
                onClick={() => {
                  setMoveCardId(tooltipCard.id);
                  appRef.current?.setMoveMode(tooltipCard.id);
                  setTooltip(null);
                }}>
                Move Card
              </button>
              <button onClick={() => startConnect(tooltipCard.id)}>
                Connect
              </button>
              <button onClick={() => startDisconnect(tooltipCard)}>
                Unconnect
              </button>
              <button onClick={() => openCard(tooltipCard)}>Open Card</button>
            </>
          )}
        </div>
      )}
      {editor && (
        <div className="cardboardModalOverlay">
          <div className="cardboardModal">
            <h3>{editor.title ? "Edit Card" : "New Card"}</h3>
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
            <label>
              Background
              <input type="color" value={editor.background} onChange={(e) => setEditor({ ...editor, background: e.target.value })} />
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
            <div className="cardboardActions">
              <button onClick={() => setEditor(null)}>Cancel</button>
              <button onClick={saveEditor}>Save</button>
            </div>
          </div>
        </div>
      )}
      {deleteCard && (
        <div className="cardboardModalOverlay">
          <div className="cardboardModal">
            <h3>Remove Card</h3>
            <p>Remove “{deleteCard.title || "Untitled card"}”?</p>
            <div className="cardboardActions">
              <button onClick={() => setDeleteCard(null)}>Cancel</button>
              <button className="danger" onClick={confirmDelete}>
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
