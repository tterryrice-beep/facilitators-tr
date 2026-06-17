# PathRouter

A small, type-safe routing layer built on top of `react-router-dom` that adds:

- A **declarative config** for pages and modals (`setPage` / `setModal`).
- A **single React context** (`PathProvider` / `usePath`) exposing the current page, the current modal and the search params, all with imperative helpers (`navigate`, `open`, `close`, `set`, `change`, `delete`, `clear`).
- **URL-driven modals**: a modal is represented as a segment after `/modal/` inside the path, so it survives reloads, deep links and back/forward navigation.
- **Full TypeScript inference** of page paths and modal names from your config (`PathNamesOf<typeof config>`, `ModalNamesOf<typeof config>`).
- An optional **`ModalWrapper`** plugin (e.g. an animated popup) that can intercept the close action via a forwarded ref.

---

## File layout

```text
PathRouter/
├── index.ts                 # Public API re-exports
├── types.ts                 # All public types
├── Container/
│   ├── RouterContainer.tsx  # Renders <Routes> for pages + <ModalsContainer>
│   ├── ModalsContainer.tsx  # Renders the currently open modal
│   └── index.ts
├── Provider/
│   ├── PathProvider.tsx     # BrowserRouter + PathContext provider
│   ├── context.ts           # React context object
│   ├── usePath.ts           # Typed hook to read the context
│   └── index.ts
└── utils/
    ├── setters.ts           # setPage / setModal helpers
    ├── createRoute.ts       # Flattens the nested page config
    ├── clearSlash.ts        # Path normalization
    ├── parseSearch.ts       # Search-params merge helper
    └── index.ts
```

---

## How it works

### 1. Configuration via `setPage` / `setModal`

The config is a plain object with two sections — `pages` and `modals`:

```ts
import { setPage, setModal } from "@/modules/PathRouter";

export const config = {
  pages: {
    "/":   setPage({ component: HomePage }),
    add:   setPage({ component: AddItemPage }),
    users: {
      "/":     setPage({ component: UsersListPage }),
      ":id":   setPage({ component: UserPage }),
    },
    "*":   setPage({ component: NotFoundPage }),
  },
  modals: {
    test:    setModal({ component: TestModal }),
    confirm: setModal({ component: ConfirmModal }),
  },
} as const;
```

- `setPage({ component, redirect? })` wraps a leaf as `{ data: {...} }`. The `data` marker tells the route builder “this is a leaf, stop recursing”.
- Pages can be **nested** as plain objects — `createRoute` walks the tree and produces a flat `[{ pathName, data }]` list (see `utils/createRoute.ts`).
- A page with `redirect` (or no `component`) becomes a `<Navigate to={redirect || "/"} replace />`.
- `setModal({ component })` is just an identity helper that preserves literal types for inference.

### 2. Mounting

```tsx
import { PathProvider, PathRouterContainer } from "@/modules/PathRouter";

<PathProvider>
  <PathRouterContainer
    config={config}
    ModalWrapper={MyModalWrapper}   // optional
    fallback={<Spinner />}          // optional Suspense fallback
  />
</PathProvider>
```

- `PathProvider` mounts a `BrowserRouter` and an inner provider that derives the page path, the modal state and the search params from `useLocation()` (`Provider/PathProvider.tsx`).
- `PathRouterContainer` renders the pages inside `<Suspense>` and, if a modal is open, mounts `ModalsContainer` next to the page tree.

### 3. URL shape

A URL is split on the literal **`/modal/`** separator:

```text
/users/42/modal/confirm/extra-crumb?tab=info
└── page path ──┘     └─ modal ──┘
```

In `PathProvider`:

```ts
const [rawPagePath, modalPath] = location.pathname.split("/modal/");
const segments = (modalPath || "").split("/").filter(Boolean);
const name        = segments[0];       // "confirm"
const breadCrumbs = segments.slice(1); // ["extra-crumb"]
```

So:

- `page.path` always points to the page route the user is on, regardless of whether a modal is open.
- `modal.name` is the first segment after `/modal/`.
- `modal.breadCrumbs` are additional path segments that the modal can use for its own internal navigation/steps.
- `modal.isOpen` is `true` iff `modal.name` is set.

This means modals are **bookmarkable and shareable** out of the box and the browser back button closes the modal naturally.

### 4. The `usePath` hook

```ts
import { usePath } from "@/modules/PathRouter";

const { page, modal, searchParams } = usePath<typeof config>();

page.path;                 // current page pathname (no /modal/... suffix)
page.navigate("add");      // typed against config.pages
page.isHavePrevHistory;    // true if history.key !== "default"

modal.isOpen;
modal.name;                // current modal key (typed)
modal.breadCrumbs;         // string[] after the modal name
modal.path;                // "<name>/<crumb1>/<crumb2>"
modal.open("confirm", ["step-2"]); // typed against config.modals
modal.close();

searchParams.params;       // Record<string, string[]>
searchParams.change({ tab: "info" });           // merge (string=set, string[]=append)
searchParams.set({ tab: ["a", "b"] });          // replace per-key
searchParams.delete("tab");
searchParams.clear();
```

Passing `typeof config` as the generic gives compile-time autocomplete for both `page.navigate(...)` and `modal.open(...)` thanks to `PathNamesOf` / `ModalNamesOf` in `types.ts`.

### 5. Page rendering (`RouterContainer.tsx`)

- Calls `createRoute(config)` once (memoised) to flatten the page tree.
- Renders a single `<Routes>` switch with one `<Route>` per leaf.
- If a leaf has no `component` or has a `redirect`, the element becomes `<Navigate to={redirect || "/"} replace />`.
- The whole switch is wrapped in `<Suspense fallback={fallback}>` so lazy components work transparently.
- Modals are rendered as a **sibling** of `<Routes>`, only when `modal.isOpen` — they overlay the current page rather than replacing it.

### 6. Modal rendering (`ModalsContainer.tsx`)

- Builds a virtual location `"<pagePath>/<modalName>"` (normalized via `clearSlash`) and feeds it to a dedicated `<Routes location={routesLocation}>`. This is what makes the modal aware of the current page path.
- Each modal route is registered at `"<pagePath>/<modalName>"`, so modals can be **page-scoped** if needed.
- If the URL contains a modal name that does not exist in the config (no matching component), the container calls `modal.close()` automatically — broken/stale modal links self-heal.
- If a `ModalWrapper` is provided, it is rendered with `{ modalName, isOpen, onClose, children }` and a forwarded ref. When the user triggers close, the container prefers `ref.current.handleCloseWithAnimation()` (so the wrapper can run an exit animation), and only falls back to the raw `close()` if that method is not exposed.

The `ModalWrapper` contract:

```ts
interface ModalWrapperRef {
  handleCloseWithAnimation: () => void;
}

interface ModalWrapperProps {
  modalName?: string;
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

type ModalWrapperComponent = ForwardRefExoticComponent<
  ModalWrapperProps & RefAttributes<ModalWrapperRef>
>;
```

### 7. Path normalization (`clearSlash`)

All internal `navigate(...)` calls go through `clearSlash`:

- collapses repeated slashes (`a//b` → `a/b`);
- guarantees a single leading slash;
- strips trailing slashes (root `/` stays as `/`).

This keeps the URL canonical regardless of how the caller composed it.

### 8. Search params

`PathProvider` derives `searchParams` from `location.search` and exposes four helpers:

| Method   | Behaviour                                                                 |
| -------- | ------------------------------------------------------------------------- |
| `change` | Merge: `string` value → set the key; `string[]` value → append values.    |
| `set`    | Replace each provided key: deletes existing values, then writes new ones. |
| `delete` | Removes a key entirely.                                                   |
| `clear`  | Removes every search param.                                               |

All mutations preserve `location.hash`.

---

## Public API (re-exported from `index.ts`)

Components / hooks:

- `PathProvider` — top-level provider (mounts `BrowserRouter`).
- `PathRouterContainer` — renders pages + modals from a config.
- `usePath<C>()` — typed access to the router context.

Helpers:

- `setPage`, `setModal` — config builders.
- `clearSlash` — path normalizer.

Types:

- `RouterConfig`, `PagesRoute`, `ModalRoutes`, `ExtendedPage`
- `PageData`, `ModalData`, `ModalProps`
- `PathNamesOf<C>`, `ModalNamesOf<C>`
- `PathContextType`, `ModalState`
- `SearchParams`, `SearchParamsState`
- `ModalWrapperComponent`, `ModalWrapperProps`, `ModalWrapperRef`

---

## Minimal end-to-end example

```tsx
import {
  PathProvider,
  PathRouterContainer,
  setPage,
  setModal,
  usePath,
} from "@/modules/PathRouter";

const config = {
  pages: {
    "/":  setPage({ component: HomePage }),
    add:  setPage({ component: AddItemPage }),
    "*":  setPage({ redirect: "/" }),
  },
  modals: {
    confirm: setModal({ component: ConfirmModal }),
  },
} as const;

export const App = () => (
  <PathProvider>
    <PathRouterContainer config={config} />
  </PathProvider>
);

// Anywhere inside the tree:
const SomeButton = () => {
  const { page, modal } = usePath<typeof config>();
  return (
    <button onClick={() => modal.open("confirm")}>
      Open confirm (current page stays: {page.path})
    </button>
  );
};
```
