/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/Button";
import BoardCanvas from "./components/cardboard/BoardCanvas";
import SimpleLayout from "./components/SimpleLayout";
import "./style.scss";
import { Icon } from "@@/Icon";
import clsx from "clsx";
import {
  CARD_STORAGE_KEY,
  getCardsUpdatedAt,
  readCards,
  type CardMap,
  writeCards,
  writeCardsAt,
} from "./components/cardboard/cardTypes";
import { PrimaryButton } from "@@/PrimaryButton";
import { Text } from "@@/Text";
import { instances } from "@/config/instances";
import { useAuth } from "@/modules/FireBase";
import { Loader } from "@/components/Loader";

const Page: FC = () => {
  const [simpleMode, setSimpleMode] = useState(() => window.innerWidth <= 600);
  const [boardKey, setBoardKey] = useState(0);

  const auth = useAuth()
  const [cloudCards, setCloudCards] = useState<CardMap | undefined>();
  const [cardsSaving, setCardsSaving] = useState(false);

  useEffect(() => {
    const firebase = instances.fb();
    setCardsSaving(firebase.getState().cardsSaving);
    return firebase.listen("cardsSaving", setCardsSaving);
  }, []);

  useEffect(() => {
    let active = true;
    const loadCards = async () => {
      const localCards = readCards();
      if (!auth) {
        if (active) setCloudCards(localCards);
        return;
      }
      const remote = await instances.fb().readCards();
      if (!active) return;
      if (!remote || getCardsUpdatedAt(localCards) >= remote.updatedAt) {
        setCloudCards(localCards);
        if (remote && getCardsUpdatedAt(localCards) > remote.updatedAt) {
          await instances.fb().writeCards(localCards, getCardsUpdatedAt(localCards));
        }
        return;
      }
      const normalizedCards = normalizeCards(remote.cards);
      writeCardsAt(normalizedCards, remote.updatedAt);
      setCloudCards(normalizedCards);
    };
    void loadCards();
    return () => {
      active = false;
    };
  }, [auth]);

  const saveCards = (cards: CardMap) => {
    if (auth) void instances.fb().writeCards(cards, Date.now());
  };

  const exportCards = () => {
    const blob = new Blob([localStorage.getItem(CARD_STORAGE_KEY) ?? "{}"], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cards.json";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Cards exported successfully");
  };

  const importCards = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!isValidCardMap(parsed)) throw new Error("Invalid cards file");
      writeCards(parsed);
      setBoardKey((value) => value + 1);
      toast.success("Cards imported successfully");
    } catch {
      toast.warning("Invalid cards file");
    }
  };

  return (
    <section className="page">
      <div className="cardsModeHeader">
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center justify-start">
            <Button
              type="button"
              ariaLabel="Toggle simplified card view"
              className={clsx(
                `cardsModeButton ${simpleMode ? "enabled" : "disabled"}`,
                "center",
              )}
              onClick={() => setSimpleMode((value) => !value)}>
              <Icon name="main/List" />
            </Button>
            <Button
              type="button"
              ariaLabel="Export cards"
              className="cardsDataButton"
              onClick={exportCards}>
              Export
            </Button>
            <Button
              type="button"
              ariaLabel="Import cards"
              className="cardsDataButton"
              onClick={() =>
                document.getElementById("cards-import-input")?.click()
              }>
              Import
              <input
                id="cards-import-input"
                className="cardsImportInput"
                type="file"
                accept="application/json,.json"
                onChange={importCards}
              />
            </Button>
          </div>

          <div className="">
            {auth ? (
              <div className="relative h-10 w-10">
                <button
                  type="button"
                  aria-label={`Signed in as ${auth.displayName ?? auth.email ?? "user"}`}
                  className="h-10 w-10 overflow-hidden rounded-full border-2 border-zinc-500 bg-zinc-600 text-sm font-bold text-white"
                  title={auth.displayName ?? auth.email ?? "Signed-in user"}>
                  {auth.photoURL ? (
                    <img
                      src={auth.photoURL}
                      alt={auth.displayName ?? auth.email ?? "User avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getUserInitials(auth.displayName ?? auth.email ?? "User")
                  )}
                </button>
                {cardsSaving && (
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-full bg-black/50">
                    <Loader />
                  </div>
                )}
              </div>
            ) : (
              <PrimaryButton
                onClick={() => instances.fb?.().signInWithGoogle()}
                className="flex items-center justify-center">
                <Text>Log In</Text>
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>
      {cloudCards === undefined ? null : simpleMode ? (
        <SimpleLayout key={boardKey} />
      ) : (
        <BoardCanvas
          key={boardKey}
          initialCards={cloudCards}
          onCardsChange={saveCards}
        />
      )}
    </section>
  );
};

function isValidCardMap(value: unknown): value is CardMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.values(value as Record<string, unknown>).every((card) => {
    if (!card || typeof card !== "object") return false;
    const item = card as Record<string, unknown>;
    return (
      typeof item.id === "string" &&
      typeof item.title === "string" &&
      typeof item.text === "string" &&
      typeof item.background === "string" &&
      typeof item.width === "number" &&
      typeof item.height === "number" &&
      item.coordinates !== null &&
      typeof item.coordinates === "object" &&
      Array.isArray(item.cells) &&
      Array.isArray(item.connects)
    );
  });
}

function normalizeCards(cards: CardMap): CardMap {
  const result: CardMap = {};
  for (const [id, card] of Object.entries(cards)) {
    if (!card || typeof card !== "object") continue;
    result[id] = {
      ...card,
      id,
      updatedAt: typeof card.updatedAt === "number" ? card.updatedAt : 0,
      connects: Array.isArray(card.connects) ? card.connects : [],
    };
  }
  return result;
}

function getUserInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default Page;
