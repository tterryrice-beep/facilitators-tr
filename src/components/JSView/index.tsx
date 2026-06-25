import React, { type FC, useMemo } from "react";
import clsx from "clsx";

import {
  JS_IDENT_PART,
  JS_IDENT_START,
  JS_KEYWORDS,
  JS_LITERALS,
  JS_LONG2_OPS,
  JS_LONG3_OPS,
  JS_VIEW_COLOR,
  JS_VIEW_STYLE,
} from "./config";
import type { JSProps, JSSeg, JSSegType } from "./types";

/**
 * Грубий, толерантний токенайзер JS. Не валідує семантику —
 * тільки фарбує синтаксис, як у редакторі.
 */
const tokenize = (src: string): JSSeg[] => {
  const out: JSSeg[] = [];

  const push = (type: JSSegType, text: string) => {
    if (!text.length) return;
    out.push({ type, text });
  };

  const prevSignificant = (): JSSeg | undefined => {
    for (let k = out.length - 1; k >= 0; k--) {
      const s = out[k];
      if (s.type !== "ws" && s.type !== "comment") return s;
    }
    return undefined;
  };

  let i = 0;
  while (i < src.length) {
    const ch = src[i];

    /* whitespace */
    if (/\s/.test(ch)) {
      let j = i;
      while (j < src.length && /\s/.test(src[j])) j++;
      push("ws", src.slice(i, j));
      i = j;
      continue;
    }

    /* line comment */
    if (ch === "/" && src[i + 1] === "/") {
      let j = i + 2;
      while (j < src.length && src[j] !== "\n") j++;
      push("comment", src.slice(i, j));
      i = j;
      continue;
    }

    /* block comment */
    if (ch === "/" && src[i + 1] === "*") {
      let j = i + 2;
      while (j < src.length - 1 && !(src[j] === "*" && src[j + 1] === "/")) j++;
      j = Math.min(src.length, j + 2);
      push("comment", src.slice(i, j));
      i = j;
      continue;
    }

    /* string: single / double */
    if (ch === '"' || ch === "'") {
      const q = ch;
      let j = i + 1;
      while (j < src.length && src[j] !== q) {
        if (src[j] === "\\") {
          j += 2;
          continue;
        }
        if (src[j] === "\n") break; // не "ковтаємо" зайве при незакритому рядку
        j++;
      }
      if (src[j] === q) j++;
      push("string", src.slice(i, j));
      i = j;
      continue;
    }

    /* template literal: `...${expr}...` */
    if (ch === "`") {
      push("string", "`");
      let j = i + 1;
      let chunkStart = j;
      while (j < src.length && src[j] !== "`") {
        if (src[j] === "\\") {
          j += 2;
          continue;
        }
        if (src[j] === "$" && src[j + 1] === "{") {
          if (j > chunkStart) push("string", src.slice(chunkStart, j));
          let depth = 1;
          let k = j + 2;
          while (k < src.length && depth > 0) {
            if (src[k] === "{") depth++;
            else if (src[k] === "}") {
              depth--;
              if (depth === 0) {
                k++;
                break;
              }
            }
            k++;
          }
          push("punct", "${");
          for (const s of tokenize(src.slice(j + 2, k - 1))) out.push(s);
          push("punct", "}");
          j = k;
          chunkStart = j;
          continue;
        }
        j++;
      }
      if (j > chunkStart) push("string", src.slice(chunkStart, j));
      if (src[j] === "`") {
        push("string", "`");
        j++;
      }
      i = j;
      continue;
    }

    /* number */
    if (/\d/.test(ch) || (ch === "." && /\d/.test(src[i + 1] || ""))) {
      let j = i;
      if (ch === "0" && /[xXbBoO]/.test(src[j + 1] || "")) {
        j += 2;
        while (j < src.length && /[0-9a-fA-F_]/.test(src[j])) j++;
      } else {
        while (j < src.length && /[\d_]/.test(src[j])) j++;
        if (src[j] === ".") {
          j++;
          while (j < src.length && /[\d_]/.test(src[j])) j++;
        }
        if (/[eE]/.test(src[j] || "")) {
          j++;
          if (/[+-]/.test(src[j] || "")) j++;
          while (j < src.length && /\d/.test(src[j])) j++;
        }
      }
      if (src[j] === "n") j++; // bigint
      push("number", src.slice(i, j));
      i = j;
      continue;
    }

    /* identifier / keyword / literal */
    if (JS_IDENT_START.test(ch)) {
      let j = i;
      while (j < src.length && JS_IDENT_PART.test(src[j])) j++;
      const word = src.slice(i, j);
      let type: JSSegType = "ident";

      if (JS_KEYWORDS.has(word)) {
        type = "keyword";
      } else if (JS_LITERALS.has(word)) {
        type = "literal";
      } else {
        /* peek для виявлення виклику функції / методу */
        let k = j;
        while (k < src.length && /\s/.test(src[k])) k++;
        const prev = prevSignificant();
        const isProp = prev?.type === "punct" && prev.text === ".";
        if (src[k] === "(") type = "fn";
        else if (isProp) type = "prop";
      }

      push(type, word);
      i = j;
      continue;
    }

    /* punctuation — за замовчуванням 1 символ; склеюємо «довгі» оператори */
    const three = src.slice(i, i + 3);
    if (JS_LONG3_OPS.includes(three)) {
      push("punct", three);
      i += 3;
      continue;
    }
    const two = src.slice(i, i + 2);
    if (JS_LONG2_OPS.includes(two)) {
      push("punct", two);
      i += 2;
      continue;
    }
    push("punct", ch);
    i += 1;
  }

  return out;
};

/* ─────────────────────────── styling ─────────────────────────── */

const renderSegments = (segs: JSSeg[]) =>
  segs.map((s, i) => (
    <span key={i} style={{ color: JS_VIEW_COLOR[s.type] }}>
      {s.text}
    </span>
  ));

/* ─────────────────────────── component ─────────────────────────── */

export const JSView: FC<JSProps> = ({ children, className }) => {
  const segments = useMemo(() => tokenize(String(children ?? "")), [children]);

  return (
    <pre className={clsx(className)} style={JS_VIEW_STYLE}>
      {renderSegments(segments)}
    </pre>
  );
};
