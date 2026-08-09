import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export interface CardView {
  container: Container;
  cardId: string;
  visible: boolean;
  dirty: boolean;
  destroy(): void;
  setPosition(x: number, y: number): void;
  setSize(w: number, h: number): void;
  setColor(color: string): void;
  setTitle(title: string): void;
  setText(text: string): void;
  setZIndex(z: number): void;
  setSelected(selected: boolean): void;
}

export function createCardView(cardId: string, w: number, h: number, color: string, title: string, text: string): CardView {
  const container = new Container();

  // Mask for clipping
  const mask = new Graphics();
  container.addChild(mask);
  container.mask = mask;

  const bg = new Graphics();
  const titleText = new Text(title, new TextStyle({
    fontSize: 14, fontWeight: 'bold', fill: '#ffffff',
    fontFamily: 'Arial, sans-serif', wordWrap: true, wordWrapWidth: w - 16,
  }));
  const bodyText = new Text(text, new TextStyle({
    fontSize: 11, fill: '#cccccc',
    fontFamily: 'Arial, sans-serif', wordWrap: true, wordWrapWidth: w - 16,
    breakWords: true,
  }));

  titleText.position.set(8, 8);
  bodyText.position.set(8, 28);

  container.addChild(bg);
  container.addChild(titleText);
  container.addChild(bodyText);

  const view: CardView = {
    container, cardId, visible: true, dirty: true,
    destroy() { container.destroy({ children: true }); },
    setPosition(x, y) { container.position.set(x, y); },
    setSize(nw, nh) {
      mask.clear();
      mask.beginFill(0xffffff, 0);
      mask.drawRoundedRect(0, 0, nw, nh, 8);
      mask.endFill();
      bg.clear();
      bg.beginFill(parseColor(color), 1);
      bg.drawRoundedRect(0, 0, nw, nh, 8);
      bg.endFill();
      (titleText.style as TextStyle).wordWrapWidth = nw - 16;
      (bodyText.style as TextStyle).wordWrapWidth = nw - 16;
      // Clip body text if it overflows
      if (bodyText.height > nh - 30) {
        bodyText.visible = bodyText.height <= nh - 30;
      }
      container.width = nw;
      container.height = nh;
    },
    setColor(c) {
      bg.clear();
      bg.beginFill(parseColor(c), 1);
      bg.drawRoundedRect(0, 0, container.width || 200, container.height || 120, 8);
      bg.endFill();
    },
    setTitle(t) { titleText.text = t; },
    setText(t) { bodyText.text = t; },
    setZIndex(z) { container.zIndex = 100 + z % 100000; },
    setSelected(selected) {
      bg.clear();
      bg.beginFill(parseColor(color), 1);
      bg.drawRoundedRect(0, 0, container.width || 200, container.height || 120, 8);
      bg.endFill();
      if (selected) {
        bg.lineStyle(2, 0x4a9eff, 1);
        bg.drawRoundedRect(0, 0, container.width || 200, container.height || 120, 8);
      }
    },
  };

  view.setSize(w, h);
  return view;
}

function parseColor(color: string): number {
  if (color.startsWith('#')) return parseInt(color.slice(1), 16);
  return 0x2d3748;
}