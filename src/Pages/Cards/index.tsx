import React, {
  type FC,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

import { BoardRenderer, type CardId } from '@/modules/Renderer';
import { useTranslate } from '@/providers/LocaleProvider/hook';
import css from './style.module.scss';

const Page: FC = () => {
  const { getText } = useTranslate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<BoardRenderer | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const renderer = new BoardRenderer({ wrapper: wrapperRef.current });
    rendererRef.current = renderer;

    // Try to load saved state
    const loaded = renderer.tryLoadFromStorage();

    if (!loaded) {
      // Seed with demo cards
      renderer.seedDemoData();
      renderer.save();
    }

    // Listen to history changes
    const unsub = renderer.onHistoryChange(({ canUndo: u, canRedo: r }) => {
      setCanUndo(u);
      setCanRedo(r);
    });

    // Initial history state
    setCanUndo(renderer.getHistoryState().canUndo);
    setCanRedo(renderer.getHistoryState().canRedo);

    // Handle resize
    const handleResize = () => renderer.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      unsub();
      renderer.destroy();
      rendererRef.current = null;
    };
  }, []);

  const handleAddCard = useCallback(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    renderer.addDemoCard('New Card', Math.random() * 500 - 250, Math.random() * 400 - 200);
    renderer.save();
  }, []);

  return (
    <section className={css.page}>
      <div className={css.toolbar}>
        <button onClick={handleAddCard} className={css.btn}>+ Add Card</button>
        <button
          onClick={() => { rendererRef.current?.save(); }}
          className={css.btn}
        >
          Save
        </button>
        <span className={css.info}>
          Pan: Scroll | Space+Drag | Middle Btn &nbsp;|&nbsp;
          Zoom: Ctrl+Scroll | +/-
        </span>
      </div>
      <div
        ref={wrapperRef}
        className={css.canvasWrapper}
        tabIndex={0}
      />
    </section>
  );
};

export default Page;
