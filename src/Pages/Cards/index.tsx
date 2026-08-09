import React, { type FC, useEffect, useRef, useState, useCallback } from 'react';
import { BoardRenderer, type CardId } from '@/modules/Renderer';
import css from './style.module.scss';

interface ContextMenuState {
  x: number; y: number;
  worldX: number; worldY: number;
  cardId: CardId | null;
  visible: boolean;
}

interface SettingsState {
  bgColor: string;
  gridEnabled: boolean;
  gridColor: string;
}

const GRID_CELL = 50; // Grid cell size in pixels

const Page: FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<BoardRenderer | null>(null);

  const [ctxMenu, setCtxMenu] = useState<ContextMenuState>({ x: 0, y: 0, worldX: 0, worldY: 0, cardId: null, visible: false });
  const [showConfirm, setShowConfirm] = useState<CardId | null>(null);
  const [showEditor, setShowEditor] = useState<CardId | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorText, setEditorText] = useState('');
  const [editorW, setEditorW] = useState(4);
  const [editorH, setEditorH] = useState(4);

  const [settings, setSettings] = useState<SettingsState>({
    bgColor: '#1a1a2e',
    gridEnabled: true,
    gridColor: 'rgba(255, 255, 255, 0.08)',
  });

  useEffect(() => {
    if (!wrapperRef.current) return;
    const renderer = new BoardRenderer({ wrapper: wrapperRef.current });
    rendererRef.current = renderer;

    const loaded = renderer.tryLoadFromStorage();
    if (!loaded) { renderer.seedDemoData(); renderer.save(); }

    // Sync settings from board
    const bs = renderer.getBoardSettings();
    setSettings({
      bgColor: bs.rendering.backgroundColor,
      gridEnabled: bs.grid.enabled,
      gridColor: bs.grid.color,
    });

    // Context menu handler
    renderer.onContextMenu((x, y, wx, wy, cardId) => {
      setCtxMenu({ x, y, worldX: wx, worldY: wy, cardId, visible: true });
    });

    const handleResize = () => renderer.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.destroy();
      rendererRef.current = null;
    };
  }, []);

  // Close context menu on any click outside
  const closeContextMenu = useCallback(() => setCtxMenu(p => ({ ...p, visible: false })), []);

  const handleContextAction = useCallback((action: string) => {
    const r = rendererRef.current;
    if (!r) return;
    const cardId = ctxMenu.cardId;
    closeContextMenu();

    switch (action) {
      case 'add': {
        r.createCard({ title: 'New Card', text: '',
          x: ctxMenu.worldX, y: ctxMenu.worldY, width: 200, height: 120 });
        r.save();
        break;
      }
      case 'remove':
        if (cardId) setShowConfirm(cardId);
        break;
      case 'connect':
        if (cardId) r.startConnectMode(cardId);
        break;
      case 'disconnect':
        if (cardId) { r.disconnectCard(cardId); r.save(); }
        break;
    }
  }, [ctxMenu, closeContextMenu]);

  const confirmDelete = useCallback(() => {
    if (showConfirm) {
      rendererRef.current?.deleteCard(showConfirm);
      rendererRef.current?.save();
      setShowConfirm(null);
    }
  }, [showConfirm]);

  // Double-click detection
  const doubleClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const r = rendererRef.current;
    if (!r) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onDbl = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const cardId = r.getCardAtScreen(sx, sy);
      if (cardId) {
        const card = r.getCard(cardId);
        if (card) {
          setEditorTitle(card.title);
          setEditorText(card.text);
          setEditorW(Math.round(card.size.width / GRID_CELL));
          setEditorH(Math.round(card.size.height / GRID_CELL));
          setShowEditor(cardId);
        }
      }
    };

    wrapper.addEventListener('dblclick', onDbl);
    return () => wrapper.removeEventListener('dblclick', onDbl);
  }, []);

  const saveCardEdit = useCallback(() => {
    if (showEditor && rendererRef.current) {
      rendererRef.current.updateCard(showEditor, editorTitle, editorText,
        editorW * GRID_CELL, editorH * GRID_CELL);
      rendererRef.current.save();
      setShowEditor(null);
    }
  }, [showEditor, editorTitle, editorText, editorW, editorH]);

  const applySettings = useCallback(() => {
    const r = rendererRef.current;
    if (!r) return;
    r.setBackgroundColor(settings.bgColor);
    r.setGridEnabled(settings.gridEnabled);
    r.setGridColor(settings.gridColor);
    r.save();
    setShowSettings(false);
  }, [settings]);

  return (
    <section className={css.page} onClick={closeContextMenu}>
      <div className={css.toolbar}>
        <button onClick={() => setShowSettings(true)} className={css.btn}>⚙ Settings</button>
        <button onClick={() => { rendererRef.current?.save(); }} className={css.btn}>Save</button>
        <span className={css.info}>
          LMB drag = pan | Wheel = zoom | Arrows = pan | RMB = menu
        </span>
      </div>
      <div ref={wrapperRef} className={css.canvasWrapper} tabIndex={0} />

      {/* Context Menu */}
      {ctxMenu.visible && (
        <div className={css.contextMenu} style={{ left: ctxMenu.x, top: ctxMenu.y }} onClick={e => e.stopPropagation()}>
          <div className={css.menuItem} onClick={() => handleContextAction('add')}>+ Add Card</div>
          {ctxMenu.cardId && (
            <>
              <div className={css.menuItem} onClick={() => handleContextAction('remove')}>✖ Remove Card</div>
              <div className={css.menuItem} onClick={() => handleContextAction('connect')}>→ Connect</div>
              <div className={css.menuItem} onClick={() => handleContextAction('disconnect')}>✕ Disconnect</div>
            </>
          )}
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {showConfirm && (
        <div className={css.modalOverlay} onClick={() => setShowConfirm(null)}>
          <div className={css.modal} onClick={e => e.stopPropagation()}>
            <h3>Delete Card?</h3>
            <p>This will remove the card and all its connections. This action can be undone.</p>
            <div className={css.modalBtns}>
              <button className={css.btnCancel} onClick={() => setShowConfirm(null)}>Cancel</button>
              <button className={css.btnDanger} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Card Editor Modal */}
      {showEditor && (
        <div className={css.modalOverlay} onClick={() => setShowEditor(null)}>
          <div className={css.modal} onClick={e => e.stopPropagation()}>
            <h3>Edit Card</h3>
            <label className={css.field}>
              Title:
              <input value={editorTitle} onChange={e => setEditorTitle(e.target.value)} className={css.input} />
            </label>
            <label className={css.field}>
              Text:
              <textarea value={editorText} onChange={e => setEditorText(e.target.value)} className={css.textarea} rows={3} />
            </label>
            <div className={css.row}>
              <label className={css.field}>
                Width (cells):
                <input type="number" value={editorW} min={2} max={20}
                  onChange={e => setEditorW(Math.max(2, parseInt(e.target.value) || 4))}
                  className={css.inputSmall} />
              </label>
              <label className={css.field}>
                Height (cells):
                <input type="number" value={editorH} min={2} max={20}
                  onChange={e => setEditorH(Math.max(2, parseInt(e.target.value) || 4))}
                  className={css.inputSmall} />
              </label>
            </div>
            <div className={css.modalBtns}>
              <button className={css.btnCancel} onClick={() => setShowEditor(null)}>Cancel</button>
              <button className={css.btnPrimary} onClick={saveCardEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className={css.modalOverlay} onClick={() => setShowSettings(false)}>
          <div className={css.modal} onClick={e => e.stopPropagation()}>
            <h3>Board Settings</h3>
            <label className={css.field}>
              Background Color:
              <div className={css.row}>
                <input type="color" value={settings.bgColor}
                  onChange={e => setSettings(s => ({ ...s, bgColor: e.target.value }))}
                  className={css.colorPicker} />
                <input value={settings.bgColor}
                  onChange={e => setSettings(s => ({ ...s, bgColor: e.target.value }))}
                  className={css.input} />
              </div>
            </label>
            <label className={css.checkbox}>
              <input type="checkbox" checked={settings.gridEnabled}
                onChange={e => setSettings(s => ({ ...s, gridEnabled: e.target.checked }))} />
              Show Grid
            </label>
            {settings.gridEnabled && (
              <label className={css.field}>
                Grid Color:
                <input value={settings.gridColor}
                  onChange={e => setSettings(s => ({ ...s, gridColor: e.target.value }))}
                  className={css.input} />
              </label>
            )}
            <div className={css.modalBtns}>
              <button className={css.btnCancel} onClick={() => setShowSettings(false)}>Cancel</button>
              <button className={css.btnPrimary} onClick={applySettings}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Page;
