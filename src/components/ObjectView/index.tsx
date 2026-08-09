import { useState, type FC } from "react";
import clsx from "clsx";

import { JSXView } from "@@/JSXView";

import type { ObjectViewProps } from "./type";

/**
 * Якщо рядок виглядає як `<>…</>` (з можливими пробілами/переносами навколо),
 * повертає вміст між фрагментами. Інакше — `null`.
 *
 * Використовується, щоб у `ObjectView` рендерити такі рядки через `JSXView`.
 */
const matchJsxFragment = (s: string): string | null => {
  const m = /^\s*<>([\s\S]*)<\/>\s*$/.exec(s);
  return m ? m[1] : null;
};

/* ─────────────────────────── helpers ─────────────────────────── */

const COLOR = {
  key: "#9cdcfe",
  string: "#ce9178",
  number: "#b5cea8",
  keyword: "#569cd6",
  symbol: "#4ec9b0",
  fn: "#dcdcaa",
  muted: "#7d8590",
  punct: "#d4d4d4",
} as const;

type AnyFn = (...args: unknown[]) => unknown;

const isPlainObjectLike = (v: unknown): v is object =>
  typeof v === "object" && v !== null;

const isClassConstructor = (fn: AnyFn): boolean => {
  try {
    return /^class[\s{]/.test(Function.prototype.toString.call(fn));
  } catch {
    return false;
  }
};

const getFunctionLabel = (fn: AnyFn): string => {
  const name = fn.name || "(anonymous)";
  return isClassConstructor(fn) ? `class ${name}` : `ƒ ${name}()`;
};

const getFunctionSource = (fn: AnyFn): string | null => {
  try {
    const src = Function.prototype.toString.call(fn);
    if (/\[native code\]/.test(src)) return null;
    return src;
  } catch {
    return null;
  }
};

/** Власні (не успадковані) перелічувані пари ключ-значення. Жодного prototype. */
const getEntries = (v: object): [string, unknown][] => {
  if (Array.isArray(v)) return v.map((item, i) => [String(i), item]);
  if (v instanceof Map)
    return Array.from(v.entries(), ([k, val]) => [
      typeof k === "string" ? k : String(k),
      val,
    ]);
  if (v instanceof Set)
    return Array.from(v.values(), (val, i) => [String(i), val]);
  return Object.entries(v);
};

const getPreview = (v: unknown): string => {
  if (Array.isArray(v)) return `Array(${v.length})`;
  if (v instanceof Map) return `Map(${v.size})`;
  if (v instanceof Set) return `Set(${v.size})`;
  if (v instanceof Date) return `Date "${v.toISOString()}"`;
  if (v instanceof RegExp) return v.toString();
  if (isPlainObjectLike(v)) {
    const ctor =
      (v as object).constructor?.name &&
      (v as object).constructor.name !== "Object"
        ? `${(v as object).constructor.name} `
        : "";
    const empty = Object.keys(v as object).length === 0;
    return `${ctor}{${empty ? "" : "…"}}`;
  }
  return "";
};

const formatPrimitive = (v: unknown): { text: string; color: string } => {
  if (v === null) return { text: "null", color: COLOR.keyword };
  if (v === undefined) return { text: "undefined", color: COLOR.muted };
  switch (typeof v) {
    case "string":
      return { text: `"${v}"`, color: COLOR.string };
    case "number":
      return { text: String(v), color: COLOR.number };
    case "bigint":
      return { text: `${String(v)}n`, color: COLOR.number };
    case "boolean":
      return { text: String(v), color: COLOR.keyword };
    case "symbol":
      return { text: (v as symbol).toString(), color: COLOR.symbol };
    default:
      return { text: String(v), color: COLOR.punct };
  }
};

const isExpandable = (v: unknown): boolean => {
  if (v === null || v === undefined) return false;
  if (typeof v === "function") return getFunctionSource(v as AnyFn) !== null;
  if (typeof v !== "object") return false;
  if (v instanceof Date || v instanceof RegExp) return false;
  return getEntries(v).length > 0;
};

/* ─────────────────────────── Node ─────────────────────────── */

interface NodeProps {
  name?: string;
  value: unknown;
  depth: number;
  /** Якщо `true` — нода завжди розгорнена і не реагує на клік (корінь). */
  pinnedOpen?: boolean;
  /** Початковий стан розгортання для не-пристебнутих нод. */
  defaultOpen?: boolean;
}

const Chevron: FC<{ open: boolean; visible: boolean }> = ({
  open,
  visible,
}) => (
  <span
    style={{
      display: "inline-block",
      width: 12,
      color: COLOR.muted,
      userSelect: "none",
      visibility: visible ? "visible" : "hidden",
    }}>
    {open ? "▾" : "▸"}
  </span>
);

const KeyLabel: FC<{ name?: string }> = ({ name }) =>
  name === undefined ? null : (
    <>
      <span style={{ color: COLOR.key }}>{name}</span>
      <span style={{ color: COLOR.punct }}>: </span>
    </>
  );

const Node: FC<NodeProps> = ({
  name,
  value,
  depth,
  pinnedOpen,
  defaultOpen,
}) => {
  const expandable = isExpandable(value);
  const [open, setOpen] = useState<boolean>(!!defaultOpen);
  const actuallyOpen = pinnedOpen || (expandable && open);

  const toggle = () => {
    if (pinnedOpen || !expandable) return;
    setOpen((o) => !o);
  };

  const rowStyle: React.CSSProperties = {
    cursor: !pinnedOpen && expandable ? "pointer" : "default",
    display: "flex",
    alignItems: "baseline",
    gap: 2,
  };

  const childPad: React.CSSProperties = { paddingLeft: 14 };

  /* Функція / клас */
  if (typeof value === "function") {
    const source = getFunctionSource(value as AnyFn);
    return (
      <div>
        <div style={rowStyle} onClick={toggle}>
          <Chevron open={!!actuallyOpen} visible={!!source && !pinnedOpen} />
          <KeyLabel name={name} />
          <span style={{ color: COLOR.fn }}>
            {getFunctionLabel(value as AnyFn)}
          </span>
        </div>
        {actuallyOpen && source && (
          <pre
            style={{
              ...childPad,
              margin: 0,
              color: COLOR.punct,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
            {source}
          </pre>
        )}
      </div>
    );
  }

  /* Об'єкт / масив / Map / Set */
  if (
    isPlainObjectLike(value) &&
    !(value instanceof Date) &&
    !(value instanceof RegExp)
  ) {
    const entries = getEntries(value);
    return (
      <div>
        <div style={rowStyle} onClick={toggle}>
          <Chevron open={!!actuallyOpen} visible={expandable && !pinnedOpen} />
          <KeyLabel name={name} />
          <span style={{ color: COLOR.muted }}>{getPreview(value)}</span>
        </div>
        {actuallyOpen && (
          <div style={childPad}>
            {entries.map(([k, v]) => (
              <Node
                key={k}
                name={k}
                value={v}
                depth={depth + 1}
                defaultOpen={defaultOpen}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  /* Рядок-JSX-фрагмент: "<>…</>" → рендеримо як JSX через JSXView, без обгорток. */
  if (typeof value === "string") {
    const jsx = matchJsxFragment(value);
    if (jsx !== null) {
      return (
        <div>
          <div style={rowStyle}>
            <Chevron open={false} visible={false} />
            <KeyLabel name={name} />
            <span style={{ color: COLOR.muted }}>{"<jsx/>"}</span>
          </div>
          <div style={childPad}>
            <JSXView>{jsx}</JSXView>
          </div>
        </div>
      );
    }
  }

  /* Примітиви + Date / RegExp */
  const display =
    value instanceof Date
      ? { text: `Date "${value.toISOString()}"`, color: COLOR.string }
      : value instanceof RegExp
        ? { text: value.toString(), color: COLOR.string }
        : formatPrimitive(value);

  return (
    <div style={rowStyle}>
      <Chevron open={false} visible={false} />
      <KeyLabel name={name} />
      <span style={{ color: display.color }}>{display.text}</span>
    </div>
  );
};

/* ─────────────────────────── Public component ─────────────────────────── */

export const ObjectView: FC<ObjectViewProps> = ({
  data,
  name,
  className,
  defaultExpanded,
}) => {
  return (
    <div
      className={clsx(className)}
      style={{
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
        fontSize: 13,
        lineHeight: 1.55,
        background: "#1e1e1e",
        color: COLOR.punct,
        padding: 12,
        borderRadius: 6,
        overflow: "auto",
      }}>
      <Node
        value={data}
        name={name}
        depth={0}
        pinnedOpen
        defaultOpen={defaultExpanded === true}
      />
    </div>
  );
};
