import type { CSSProperties } from "react";

import type { JSSegType } from "./types";

/** Кольори токенів — у дусі VS Code Dark+. */
export const JS_VIEW_COLOR: Record<JSSegType, string> = {
  ws: "inherit",
  comment: "#6a9955",
  string: "#ce9178",
  number: "#b5cea8",
  keyword: "#c586c0",
  literal: "#569cd6",
  fn: "#dcdcaa",
  prop: "#9cdcfe",
  ident: "#d4d4d4",
  punct: "#d4d4d4",
};

/** Зарезервовані ключові слова JS (керівні + декларативні). */
export const JS_KEYWORDS = new Set<string>([
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "default",
  "break",
  "continue",
  "class",
  "extends",
  "super",
  "new",
  "this",
  "await",
  "async",
  "try",
  "catch",
  "finally",
  "throw",
  "import",
  "export",
  "from",
  "as",
  "in",
  "of",
  "typeof",
  "instanceof",
  "void",
  "delete",
  "yield",
  "static",
  "get",
  "set",
]);

/** Літерали-значення, які фарбуються як «keyword-літерал». */
export const JS_LITERALS = new Set<string>([
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity",
]);

/** Регекси для розпізнавання ідентифікаторів. */
export const JS_IDENT_START = /[A-Za-z_$]/;
export const JS_IDENT_PART = /[A-Za-z0-9_$]/;

/** Багатосимвольні оператори (склеюємо в один токен, щоб не «розривалися»). */
export const JS_LONG3_OPS: readonly string[] = [
  "===",
  "!==",
  "**=",
  "...",
  ">>>",
  "<<=",
  ">>=",
  "&&=",
  "||=",
  "??=",
];

export const JS_LONG2_OPS: readonly string[] = [
  "==",
  "!=",
  "<=",
  ">=",
  "&&",
  "||",
  "??",
  "=>",
  "++",
  "--",
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
  "**",
  "<<",
  ">>",
  "&=",
  "|=",
  "^=",
  "?.",
];

/** Стильові константи для контейнера `<pre>`. */
export const JS_VIEW_STYLE: CSSProperties = {
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  fontSize: 13,
  lineHeight: 1.55,
  background: "#1e1e1e",
  color: JS_VIEW_COLOR.ident,
  padding: 12,
  borderRadius: 6,
  margin: 0,
  overflow: "auto",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};
