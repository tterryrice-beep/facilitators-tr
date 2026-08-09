import React, { useMemo, useState, type FC } from "react";
import {
  CARD_STORAGE_KEY,
  type CardEntity,
  type CardMap,
} from "./cardboard/cardTypes";
import { DEFAULT_CARD_BACKGROUND } from "./cardboard/constants";

interface SimpleLayoutProps {}

const SimpleLayout: FC<SimpleLayoutProps> = ({}) => {
  const [selectedCard, setSelectedCard] = useState<CardEntity | null>(null);
  const cards = useMemo(() => readSimpleCards(), []);

  const groups = useMemo(() => groupCards(Object.values(cards)), [cards]);

  return (
    <div className="simpleLayout">
      <div className="simpleLayoutGroups">
        {groups.map((group) => (
          <div
            className="simpleLayoutGroup"
            key={group.map((card) => card.id).join("-")}>
            {group.map((card) => (
              <button
                className="simpleLayoutCard"
                key={card.id}
                type="button"
                style={{
                  backgroundColor: validBackground(card.background)
                    ? card.background
                    : DEFAULT_CARD_BACKGROUND,
                }}
                onClick={() => setSelectedCard(card)}>
                {card.title || "Untitled card"}
              </button>
            ))}
          </div>
        ))}
      </div>
      {selectedCard && (
        <div
          className="cardboardModalOverlay"
          onClick={() => setSelectedCard(null)}>
          <div
            className="cardboardModal simpleLayoutModal"
            onClick={(event) => event.stopPropagation()}>
            <h3>{selectedCard.title || "Untitled card"}</h3>
            <div className="simpleLayoutText">{selectedCard.text}</div>
            <div className="cardboardActions">
              <button type="button" onClick={() => setSelectedCard(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function readSimpleCards(): CardMap {
  try {
    const raw = localStorage.getItem(CARD_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CardMap;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

function groupCards(cards: CardEntity[]): CardEntity[][] {
  const byId = new Map(cards.map((card) => [card.id, card]));
  const visited = new Set<string>();
  const groups: CardEntity[][] = [];

  for (const card of cards) {
    if (visited.has(card.id)) continue;
    const group: CardEntity[] = [];
    const queue = [card.id];
    visited.add(card.id);
    while (queue.length) {
      const id = queue.shift()!;
      const current = byId.get(id);
      if (!current) continue;
      group.push(current);
      for (const connection of current.connects ?? []) {
        if (byId.has(connection.id) && !visited.has(connection.id)) {
          visited.add(connection.id);
          queue.push(connection.id);
        }
      }
    }
    groups.push(group);
  }
  return groups;
}

function validBackground(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

export default SimpleLayout;
