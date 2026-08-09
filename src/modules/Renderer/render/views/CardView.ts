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

export function createCardView(cardId: string, width: number, height: number, color: string, title: string, text: string): CardView {
  const container = new Container();
  container.visible = true;

  const bg = new Graphics();
  const titleText = new Text(title, new TextStyle({
    fontSize: 14, fontWeight: 'bold', fill: '#ffffff',
    fontFamily: 'Arial, sans-serif', wordWrap: true, wordWrapWidth: width - 16,
  }));
  const bodyText = new Text(text, new TextStyle({
    fontSize: 11, fill: '#cccccc',
    fontFamily: 'Arial, sans-serif', wordWrap: true, wordWrapWidth: width - 16,
  }));

  titleText.position.set(8, 8);
  bodyText.position.set(8, 30);

  container.addChild(bg);
  container.addChild(titleText);
  container.addChild(bodyText);

  const view: CardView = {
    container,
    cardId,
    visible: true,
    dirty: true,
    destroy() { container.destroy({ children: true }); },
    setPosition(x, y) { container.position.set(x, y); },
    setSize(w, h) {
      bg.clear();
      bg.beginFill(parseColor(color), 1);
      bg.drawRoundedRect(0, 0, w, h, 8);
      bg.endFill();
      (titleText.style as TextStyle).wordWrapWidth = w - 16;
      (bodyText.style as TextStyle).wordWrapWidth = w - 16;
    },
    setColor(c) {
      bg.clear();
      bg.beginFill(parseColor(c), 1);
      bg.drawRoundedRect(0, 0, container.width, container.height, 8);
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

  view.setSize(width, height);
  return view;
}

function parseColor(color: string): number {
  if (color.startsWith('#')) {
    return parseInt(color.slice(1), 16);
  }
  return 0x2d3748;
}