import React, { useEffect, useRef, useState, type FC } from "react";
import { toast } from "react-toastify";
import { CardBoardApp } from "./CardBoardApp";
import type { CardEntity } from "./cardTypes";
import { DEFAULT_CARD_HEIGHT, DEFAULT_CARD_WIDTH, DEFAULT_COLORS_LIST } from "./constants";
import type { CellCoord } from "./types";
import type { CardMap } from "./cardTypes";
import { Icon } from "@@/Icon";

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

interface BoardCanvasProps {
  initialCards?: CardMap;
  onCardsChange?: (cards: CardMap) => void;
}

const BoardCanvas: FC<BoardCanvasProps> = ({ initialCards, onCardsChange }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const boardAppRef = useRef<HTMLDivElement>(null);
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
  const [editorColors, setEditorColors] = useState<string[]>(DEFAULT_COLORS_LIST);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(document.fullscreenElement === boardAppRef.current);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    const element = boardAppRef.current;
    if (!element) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (element.requestFullscreen) {
      await element.requestFullscreen();
    }
  };

  useEffect(() => {
    if (!tooltip) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && !tooltipRef.current?.contains(target)) setTooltip(null);
    };
    document.addEventListener("click", closeOnOutsideClick);
    return () => document.removeEventListener("click", closeOnOutsideClick);
  }, [tooltip]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const app = new CardBoardApp(wrapperRef.current, {
      initialCards,
      onCardsChange,
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
    setEditorColors(getEditorColors());
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
    setEditorColors(getEditorColors());
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
  const getEditorColors = (): string[] => {
    const existing = appRef.current
      ? Object.values(appRef.current.getCards()).map((card) => card.background)
      : [];
    return [...new Set([...DEFAULT_COLORS_LIST, ...existing])];
  };
  const saveEditor = (): boolean => {
    if (!editor || !appRef.current) return false;
    const savedCard = appRef.current.updateCard(editor.cardId, editor);
    if (savedCard) toast.success(`${savedCard.title || "Untitled card"} saved access`);
    return Boolean(savedCard);
  };
  const saveAndCloseEditor = () => {
    if (saveEditor()) setEditor(null);
  };
  const getRelatedCards = (cardId: string): CardEntity[] => {
    const current = appRef.current?.getCard(cardId);
    if (!current || !appRef.current) return [];
    return current.connects
      .map((connection) => appRef.current?.getCard(connection.id))
      .filter((card): card is CardEntity => Boolean(card));
  };
  const openRelatedCard = (card: CardEntity) => {
    setEditorColors(getEditorColors());
    setEditor({
      cardId: card.id,
      coordinates: { ...card.coordinates },
      title: card.title,
      text: card.text,
      background: card.background,
      width: card.width,
      height: card.height,
    });
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
    <div ref={boardAppRef} className="cardboardAppShell">
      <>
        <div className="cardboardHeader">
          <div className="cardboardZoom">Zoom: {zoomPercent}%</div>
          <button type="button" className="cardboardFullscreenButton" onClick={toggleFullscreen}>
            {isFullscreen ? "Exit Full" : "Full"}
          </button>
        </div>
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
          ref={tooltipRef}
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
            <h3>Card Data</h3>
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
            <div className="cardboardEditorColors">
              {editorColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  title={color}
                  className={editor.background === color ? "selected" : ""}
                  style={{ backgroundColor: color }}
                  onClick={() => setEditor({ ...editor, background: color })}
                />
              ))}
            </div>
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
              <div className="cardboardActionsLeft">
                <button type="button" onClick={() => setEditor(null)}>Close</button>
                <button type="button" onClick={saveEditor}>Save</button>
              </div>
              <button
                type="button"
                className="cardboardAddButton"
                aria-label="Save and close card"
                title="Save and close"
                onClick={saveAndCloseEditor}>
                <Icon name="main/Add" />
              </button>
            </div>
            {getRelatedCards(editor.cardId).length > 0 && (
              <div className="cardboardRelatedCards">
                <div className="cardboardRelatedCardsTitle">Related cards</div>
                <div className="cardboardRelatedCardsList">
                  {getRelatedCards(editor.cardId).map((card) => (
                    <button key={card.id} type="button" style={{ borderColor: card.background }} onClick={() => openRelatedCard(card)}>
                      {card.title || "Untitled card"}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
    </div>
  );
};

export default BoardCanvas;
