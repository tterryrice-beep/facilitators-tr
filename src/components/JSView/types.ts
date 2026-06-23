export interface JSProps {
  /** Сирий JS-код як рядок. */
  children: string;
  className?: string;
}

/* ─────────────────────────── tokenizer ─────────────────────────── */

export type JSSegType =
  | "ws"
  | "comment"
  | "string"
  | "number"
  | "keyword"
  | "literal"
  | "fn"
  | "prop"
  | "ident"
  | "punct";

export interface JSSeg {
  type: JSSegType;
  text: string;
}
