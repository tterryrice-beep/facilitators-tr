/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/Button";
import BoardCanvas from "./components/cardboard/BoardCanvas";
import SimpleLayout, { readSimpleCards } from "./components/SimpleLayout";
import "./style.scss";
import { Icon } from "@@/Icon";
import clsx from "clsx";
import { CARD_STORAGE_KEY, type CardMap } from "./components/cardboard/cardTypes";

const Page: FC = () => {
  const [simpleMode, setSimpleMode] = useState(() => window.innerWidth <= 600);
  const [boardKey, setBoardKey] = useState(0);

  const exportCards = () => {
    const blob = new Blob([localStorage.getItem(CARD_STORAGE_KEY) ?? "{}"], { type: "application/json" });
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
      localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(parsed));
      setBoardKey((value) => value + 1);
      toast.success("Cards imported successfully");
    } catch {
      toast.warning("Invalid cards file");
    }
  };

  return (
    <section className="page">
      <div className="cardsModeHeader">
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
        <Button type="button" ariaLabel="Export cards" className="cardsDataButton" onClick={exportCards}>Export</Button>
        <Button type="button" ariaLabel="Import cards" className="cardsDataButton" onClick={() => document.getElementById("cards-import-input")?.click()}>
          Import
          <input id="cards-import-input" className="cardsImportInput" type="file" accept="application/json,.json" onChange={importCards} />
        </Button>
      </div>
      {simpleMode ? <SimpleLayout key={boardKey} /> : <BoardCanvas key={boardKey} />}
    </section>
  );
};

function isValidCardMap(value: unknown): value is CardMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.values(value as Record<string, unknown>).every((card) => {
    if (!card || typeof card !== "object") return false;
    const item = card as Record<string, unknown>;
    return typeof item.id === "string" && typeof item.title === "string" && typeof item.text === "string" && typeof item.background === "string" && typeof item.width === "number" && typeof item.height === "number" && item.coordinates !== null && typeof item.coordinates === "object" && Array.isArray(item.cells) && Array.isArray(item.connects);
  });
}

export default Page;
