import React, { type FC, useMemo } from "react";
import clsx from "clsx";

interface Props {
  /** Сирий JSX-код як рядок. */
  children: string;
  className?: string;
}

/* ─────────────────────────── tokenizer ─────────────────────────── */

type SegType =
  | "text"
  | "punct"
  | "tag"
  | "component"
  | "attr"
  | "string"
  | "expr"
  | "error";

interface Seg {
  type: SegType;
  text: string;
}

const NAME_RE = /[A-Za-z_][\w.-]*/y;
const isComponent = (name: string) => /^[A-Z]/.test(name);

/**
 * Грубий, толерантний токенайзер JSX-подібного рядка.
 * Не валідує семантику — лише фарбує синтаксис і позначає очевидно
 * непарні / несамозакриті теги червоним.
 */
const tokenize = (src: string): Seg[] => {
  const out: Seg[] = [];
  const stack: { name: string; idxs: number[] }[] = [];

  const push = (type: SegType, text: string): number => {
    if (!text.length) return -1;
    out.push({ type, text });
    return out.length - 1;
  };

  const markError = (idxs: number[]) => {
    for (const i of idxs) if (i >= 0 && out[i]) out[i].type = "error";
  };

  let i = 0;
  while (i < src.length) {
    const ch = src[i];

    /* Звичайний текст до наступного `<` або `{`. */
    if (ch !== "<" && ch !== "{") {
      let j = i;
      while (j < src.length && src[j] !== "<" && src[j] !== "{") j++;
      push("text", src.slice(i, j));
      i = j;
      continue;
    }

    /* JSX-вираз поза тегом: {...} */
    if (ch === "{") {
      let depth = 1;
      let j = i + 1;
      while (j < src.length && depth > 0) {
        if (src[j] === "{") depth++;
        else if (src[j] === "}") {
          depth--;
          if (depth === 0) {
            j++;
            break;
          }
        }
        j++;
      }
      if (depth > 0) {
        push("error", src.slice(i));
        i = src.length;
      } else {
        push("expr", src.slice(i, j));
        i = j;
      }
      continue;
    }

    /* `<>` — фрагмент відкритий */
    if (src[i + 1] === ">") {
      const idx = push("punct", "<>");
      stack.push({ name: "", idxs: [idx] });
      i += 2;
      continue;
    }

    /* `</...>` — закриваючий тег / фрагмент */
    if (src[i + 1] === "/") {
      if (src[i + 2] === ">") {
        const idx = push("punct", "</>");
        const top = stack[stack.length - 1];
        if (top && top.name === "") stack.pop();
        else markError([idx]);
        i += 3;
        continue;
      }
      let j = i + 2;
      NAME_RE.lastIndex = j;
      const m = NAME_RE.exec(src);
      if (!m || m.index !== j) {
        push("error", src.slice(i, i + 2));
        i += 2;
        continue;
      }
      const name = m[0];
      const ltIdx = push("punct", "</");
      const nameIdx = push(isComponent(name) ? "component" : "tag", name);
      j += name.length;
      while (j < src.length && /\s/.test(src[j])) j++;
      if (src[j] !== ">") {
        markError([ltIdx, nameIdx]);
        i = j;
        continue;
      }
      const gtIdx = push("punct", ">");
      const top = stack[stack.length - 1];
      if (top && top.name === name) stack.pop();
      else markError([ltIdx, nameIdx, gtIdx]);
      i = j + 1;
      continue;
    }

    /* `<Name ...>` або `<Name ... />` */
    let j = i + 1;
    NAME_RE.lastIndex = j;
    const m = NAME_RE.exec(src);
    if (!m || m.index !== j) {
      push("error", "<");
      i += 1;
      continue;
    }
    const name = m[0];
    const idxs: number[] = [];
    idxs.push(push("punct", "<"));
    idxs.push(push(isComponent(name) ? "component" : "tag", name));
    j += name.length;

    let selfClose = false;
    let closed = false;
    while (j < src.length) {
      const wsStart = j;
      while (j < src.length && /\s/.test(src[j])) j++;
      if (j > wsStart) push("text", src.slice(wsStart, j));
      if (j >= src.length) break;
      const c = src[j];

      if (c === "/" && src[j + 1] === ">") {
        idxs.push(push("punct", "/>"));
        selfClose = true;
        closed = true;
        j += 2;
        break;
      }
      if (c === ">") {
        idxs.push(push("punct", ">"));
        closed = true;
        j += 1;
        break;
      }

      /* Атрибут */
      NAME_RE.lastIndex = j;
      const am = NAME_RE.exec(src);
      if (!am || am.index !== j) {
        push("error", src[j]);
        j += 1;
        continue;
      }
      const attrName = am[0];
      push("attr", attrName);
      j += attrName.length;

      if (src[j] === "=") {
        push("punct", "=");
        j++;
        const q = src[j];
        if (q === '"' || q === "'") {
          let k = j + 1;
          while (k < src.length && src[k] !== q) k++;
          if (k >= src.length) {
            push("error", src.slice(j));
            j = src.length;
            break;
          }
          push("string", src.slice(j, k + 1));
          j = k + 1;
        } else if (q === "{") {
          let depth = 1;
          let k = j + 1;
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
          if (depth > 0) {
            push("error", src.slice(j));
            j = src.length;
            break;
          }
          push("expr", src.slice(j, k));
          j = k;
        } else {
          push("error", src[j] ?? "");
          j += 1;
        }
      }
    }

    if (!closed) {
      markError(idxs);
      i = j;
      continue;
    }
    if (!selfClose) stack.push({ name, idxs });
    i = j;
  }

  /* Усе, що залишилось у стеку — незакриті відкриваючі теги. */
  for (const opener of stack) markError(opener.idxs);

  return out;
};

/* ─────────────────────────── styling ─────────────────────────── */

const COLOR: Record<SegType, string> = {
  text: "#d4d4d4",
  punct: "#808080",
  tag: "#569cd6",
  component: "#4ec9b0",
  attr: "#9cdcfe",
  string: "#ce9178",
  expr: "#dcdcaa",
  error: "#f48771",
};

const renderSegments = (segs: Seg[]) =>
  segs.map((s, i) => (
    <span
      key={i}
      style={{
        color: COLOR[s.type],
        ...(s.type === "error"
          ? {
              textDecoration: "underline wavy #f48771",
              textUnderlineOffset: 2,
            }
          : null),
      }}>
      {s.text}
    </span>
  ));

/* ─────────────────────────── component ─────────────────────────── */

export const JSXView: FC<Props> = ({ children, className }) => {
  const segments = useMemo(() => tokenize(String(children ?? "")), [children]);

  return (
    <pre
      className={clsx(className)}
      style={{
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
        fontSize: 13,
        lineHeight: 1.55,
        background: "#1e1e1e",
        color: COLOR.text,
        padding: 12,
        borderRadius: 6,
        margin: 0,
        overflow: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
      {renderSegments(segments)}
    </pre>
  );
};
