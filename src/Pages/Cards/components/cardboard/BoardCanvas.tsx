import React, { useRef, useEffect, useState, useCallback, type FC } from 'react';
import { Application } from 'pixi.js';
import { BoardController } from './BoardController';
import { GridRenderer } from './GridRenderer';
import { COLOR_BG } from './constants';
import type { ViewportSize } from './types';

const BoardCanvas: FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const gridRef = useRef<GridRenderer | null>(null);
  const controllerRef = useRef<BoardController>(new BoardController());
  const vpRef = useRef<ViewportSize>({ width: 0, height: 0 });
  const dirtyRef = useRef(true);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [isDragging, setIsDragging] = useState(false);

  const markDirty = useCallback(() => { dirtyRef.current = true; }, []);

  const getScreenPoint = useCallback((e: MouseEvent): { x: number; y: number } => {
    const rect = wrapperRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const updateZoomDisplay = useCallback(() => {
    setZoomPercent(Math.round(controllerRef.current.camera.zoom * 100));
  }, []);

  // ── PixiJS bootstrap ─────────────────────────────────────────────────
  useEffect(() => {
    const wrapper = wrapperRef.current!;
    const w = wrapper.clientWidth;
    const h = wrapper.clientHeight;

    const canvas = document.createElement('canvas');
    wrapper.appendChild(canvas);

    const app = new Application({
      width: w, height: h, view: canvas,
      background: COLOR_BG, antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    });

    appRef.current = app;
    vpRef.current = { width: w, height: h };

    // Grid renderer
    const grid = new GridRenderer();
    gridRef.current = grid;
    app.stage.addChild(grid.container);

    // ── Input handlers ─────────────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const sp = getScreenPoint(e);
      controllerRef.current.zoomAt(vpRef.current, sp, e.deltaY);
      updateZoomDisplay();
      markDirty();
    };
    wrapper.addEventListener('wheel', onWheel, { passive: false });

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const sp = getScreenPoint(e);
      controllerRef.current.startDrag(vpRef.current, sp);
      setIsDragging(true);
      markDirty();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!controllerRef.current.isDragging) return;
      const sp = getScreenPoint(e);
      controllerRef.current.dragMove(vpRef.current, sp.x, sp.y);
      markDirty();
    };

    const onPointerUp = () => {
      if (controllerRef.current.isDragging) {
        controllerRef.current.endDrag();
        setIsDragging(false);
        markDirty();
      }
    };

    wrapper.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (controllerRef.current.handleArrowKey(e.key)) {
        e.preventDefault();
        updateZoomDisplay();
        markDirty();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    const onResize = () => {
      const nw = wrapper.clientWidth;
      const nh = wrapper.clientHeight;
      vpRef.current = { width: nw, height: nh };
      app.renderer.resize(nw, nh);
      markDirty();
    };
    window.addEventListener('resize', onResize);

    // Render loop
    const tick = () => {
      if (dirtyRef.current) {
        dirtyRef.current = false;
        const ctrl = controllerRef.current;
        grid?.redraw(ctrl.camera, vpRef.current, ctrl.anchorCell ?? undefined);
      }
    };
    app.ticker.add(tick);
    markDirty();

    return () => {
      app.ticker.remove(tick);
      wrapper.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      grid?.destroy();
      try {
        app.destroy(true, { children: true, texture: true });
        if (wrapper.contains(canvas)) wrapper.removeChild(canvas);
      } catch { /* ignore */ }
      appRef.current = null;
      gridRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Zoom indicator */}
      <div style={{
        textAlign: 'center', padding: '4px 0',
        color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace',
        fontSize: 13, background: 'rgba(0,0,0,0.3)',
      }}>
        Zoom: {zoomPercent}%
      </div>

      <div
        ref={wrapperRef}
        style={{ flex: 1, width: '100%', overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab' }}
        tabIndex={0}
      />
    </>
  );
};

export default BoardCanvas;