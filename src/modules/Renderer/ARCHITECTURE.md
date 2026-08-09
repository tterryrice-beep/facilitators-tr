# Renderer Architecture: Infinite Canvas Card Board

## 1. Executive Summary

This document describes the architecture for a Trello / Miro / Obsidian Canvas style web application implemented with:

- **React** for application shell, routing, lifecycle, toolbars, inspectors, and optional panels.
- **TypeScript** for domain modeling and compile-time safety.
- **PixiJS v7.4.3** for all board rendering.
- **LocalStorage** for persistence.
- **No backend**.

The application is an infinite whiteboard where users can freely place cards and connect them with lines. Cards, connections, grid, selection overlays, resize handles, anchor points, and interaction previews should be rendered by PixiJS. Cards must not be rendered as HTML elements.

The architecture prioritizes maintainability, performance, scalability, and clean separation of responsibilities.

---

## 2. Goals, Deliverables, and Constraints

### Goal

Build an infinite PixiJS-powered board supporting smooth camera movement, cards, connections, selection, clipboard, undo/redo, and LocalStorage persistence.

### Deliverables

The implementation should eventually include:

1. A scalable `src/modules/Renderer/` module structure.
2. TypeScript interfaces for board, card, connection, camera, selection, history, clipboard, settings, storage, and geometry.
3. PixiJS render architecture with layers and viewport culling.
4. Camera abstraction with world/screen coordinate conversion.
5. Input manager supporting mouse, touch, wheel, and keyboard.
6. Managers for board, cards, connections, selection, history, rendering, storage, clipboard, camera, viewport, and spatial indexing.
7. Command-based undo/redo.
8. Clipboard copy/paste/duplicate.
9. LocalStorage persistence with versioned migrations.
10. Performance strategy for 10,000 cards and 30,000 connections.

### Success Criteria

The MVP is complete when users can:

- pan and zoom an infinite board smoothly;
- zoom centered on the cursor;
- create, select, multi-select, rectangle-select, move, resize, copy, paste, duplicate, and delete cards;
- connect cards with lines rendered below cards;
- move cards and see connections automatically follow;
- undo and redo required actions;
- refresh the page and recover board state from LocalStorage.

### Constraints

- Use **PixiJS v7.4.3**.
- Use **React** and **TypeScript**.
- No backend.
- Use IDs instead of object references in stored domain data.
- All board visuals are rendered on Canvas/WebGL through PixiJS.
- Avoid circular manager dependencies.
- Avoid spaghetti event handling.
- Prioritize architecture that can scale beyond MVP.

---

## 3. Existing Project Context

Relevant existing files:

```txt
src/modules/Renderer/index.ts
src/modules/StateDispatcher/
```

The current renderer module contains a `RenderStarter` abstraction that creates a Pixi `Application`, appends a canvas, creates a root `Container`, resizes the renderer, and destroys Pixi resources.

This is a good bootstrap layer, but it should be expanded into a full renderer module with a composition root and dedicated managers.

The existing `StateDispatcher` module provides a typed event-emitter-based state abstraction. It can be reused for manager-level events such as selection changed, history changed, board loaded, board saved, and settings changed.

Important recommendation: do not route every pointer-move or animation-frame update through `StateDispatcher` or React. Use it for coarse state notifications, not for high-frequency rendering internals.

---

## 4. High-Level Architecture

Use a layered architecture:

```txt
React Page / Application Shell
        ↓
BoardRenderer Facade
        ↓
Managers
        ↓
Domain State + Pixi Display Objects + Spatial Indexes
```

React owns:

- mounting and unmounting the renderer;
- route/page lifecycle;
- optional toolbar, inspector, debug panels, and shortcut help;
- high-level UI state that does not require frame-level updates.

PixiJS owns:

- board rendering;
- grid;
- cards;
- card text/images;
- connections;
- selection overlays;
- resize handles;
- connection anchors;
- pointer event capture on the canvas/stage.

Managers own domain behavior and coordinate between state, rendering, input, history, and persistence.

---

## 5. Recommended Folder Structure

Recommended structure inside `src/modules/Renderer/`:

```txt
Renderer/
  index.ts
  ARCHITECTURE.md

  core/
    BoardRenderer.ts
    RenderStarter.ts
    RendererContext.ts
    lifecycle.ts
    constants.ts

  types/
    board.ts
    card.ts
    connection.ts
    camera.ts
    selection.ts
    history.ts
    clipboard.ts
    settings.ts
    input.ts
    geometry.ts
    storage.ts

  camera/
    Camera.ts
    CameraManager.ts
    cameraMath.ts

  viewport/
    ViewportManager.ts
    viewportMath.ts

  input/
    InputManager.ts
    InputState.ts
    tools/
      BaseTool.ts
      PanTool.ts
      SelectTool.ts
      MoveCardsTool.ts
      ResizeCardTool.ts
      RectangleSelectionTool.ts
      ConnectCardsTool.ts
    shortcuts/
      KeyboardShortcutManager.ts
      shortcutMap.ts
    pointer/
      PointerTracker.ts
      WheelController.ts
      TouchController.ts

  managers/
    BoardManager.ts
    CardManager.ts
    ConnectionManager.ts
    SelectionManager.ts
    HistoryManager.ts
    ClipboardManager.ts
    StorageManager.ts
    SettingsManager.ts
    SpatialIndexManager.ts

  render/
    RenderManager.ts
    RenderLayers.ts
    RenderLoop.ts
    zIndex.ts
    factories/
      createCardView.ts
      createConnectionView.ts
      createGridView.ts
    views/
      CardView.ts
      ConnectionView.ts
      GridView.ts
      SelectionBoxView.ts
      ResizeHandlesView.ts
      AnchorPointView.ts
    pools/
      DisplayObjectPool.ts
      CardViewPool.ts
      ConnectionViewPool.ts
    text/
      TextStyleFactory.ts
      TextCache.ts
    textures/
      ImageTextureManager.ts

  spatial/
    SpatialIndex.ts
    UniformGridIndex.ts
    QuadTreeIndex.ts
    bounds.ts

  commands/
    Command.ts
    MoveCardsCommand.ts
    ResizeCardCommand.ts
    CreateCardCommand.ts
    DeleteCardsCommand.ts
    ConnectCardsCommand.ts
    DisconnectCardsCommand.ts
    CompositeCommand.ts

  persistence/
    serializers.ts
    migrations.ts
    localStorageAdapter.ts

  utils/
    id.ts
    geometry.ts
    objectClone.ts
    throttle.ts
    debounce.ts
    assertNever.ts
```

### Folder Responsibilities

| Folder | Responsibility |
| --- | --- |
| `core/` | Renderer bootstrap, public facade, lifecycle, manager composition. |
| `types/` | Domain-only TypeScript interfaces. Should not import Pixi. |
| `camera/` | Camera state, pan, zoom, fit board, coordinate conversion. |
| `viewport/` | Visible world bounds and viewport size calculations. |
| `input/` | Event normalization and interaction tools. |
| `managers/` | Domain and application managers. |
| `render/` | Pixi-specific display objects, layers, loops, pools, textures. |
| `spatial/` | Spatial indexes for hit testing, viewport culling, rectangle selection. |
| `commands/` | Undoable command objects. |
| `persistence/` | LocalStorage adapter, serialization, validation, migrations. |
| `utils/` | Generic helpers with no domain ownership. |

---

## 6. Domain Model

Domain data should be normalized and use IDs instead of object references.

### Common Types

```ts
type BoardId = string;
type CardId = string;
type ConnectionId = string;

interface Point {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
```

### Board

```ts
interface Board {
  id: BoardId;
  version: number;
  name: string;
  cards: Record<CardId, Card>;
  connections: Record<ConnectionId, Connection>;
  camera: CameraState;
  settings: BoardSettings;
  metadata: BoardMetadata;
}

interface BoardMetadata {
  createdAt: number;
  updatedAt: number;
}
```

Use records for persisted state because they serialize well and allow O(1) lookup by ID. Managers may maintain derived arrays, maps, indexes, or caches.

### Card

```ts
interface Card {
  id: CardId;
  title: string;
  text: string;
  color?: string;
  imageUrl?: string;
  position: Point;
  size: Size;
  zIndex: number;
  createdAt: number;
  updatedAt: number;
}
```

Rules:

- `position` and `size` are in world coordinates.
- Cards can overlap.
- Selection state should not be stored on the card.
- Image URL is optional and should be resolved by an image texture manager.

### Connection

```ts
interface Connection {
  id: ConnectionId;
  fromCardId: CardId;
  toCardId: CardId;
  fromAnchor: ConnectionAnchor;
  toAnchor: ConnectionAnchor;
  style: ConnectionStyle;
  createdAt: number;
  updatedAt: number;
}

interface ConnectionAnchor {
  type: 'center' | 'edge';
  edge?: 'top' | 'right' | 'bottom' | 'left';
  offset?: number;
}

interface ConnectionStyle {
  color: string;
  width: number;
  dashed?: boolean;
  arrowStart?: boolean;
  arrowEnd?: boolean;
}
```

MVP should implement center-to-center lines. The model already allows future edge anchors and arrows.

### Camera

```ts
interface CameraState {
  x: number;
  y: number;
  zoom: number;
  minZoom: number;
  maxZoom: number;
}
```

The exact convention for `x` and `y` must be centralized and documented in `Camera` / `CameraManager`. Recommended convention: `x` and `y` represent world coordinates mapped to screen origin, while `zoom` is the world-to-screen scale.

Required operations:

- `screenToWorld(point)`
- `worldToScreen(point)`
- `panBy(screenDelta)`
- `zoomAt(screenPoint, zoomDelta)`
- `fitBounds(worldBounds, padding)`

### Selection

```ts
interface SelectionState {
  selectedCardIds: Set<CardId>;
  selectedConnectionIds: Set<ConnectionId>;
  primaryCardId?: CardId;
  selectionRect?: Rect;
}
```

Selection is UI/session state and should not be persisted as part of the board by default.

### History

```ts
interface HistoryState {
  undoStack: Command[];
  redoStack: Command[];
  limit: number;
  isExecuting: boolean;
}
```

Commands are runtime objects and do not need to be persisted.

### Clipboard

```ts
interface ClipboardPayload {
  version: number;
  cards: Card[];
  connections: Connection[];
  sourceBoardId: BoardId;
  copiedAt: number;
}
```

Initial clipboard can be in-memory. Browser Clipboard API support can be added later.

### Settings

```ts
interface BoardSettings {
  grid: GridSettings;
  interaction: InteractionSettings;
  rendering: RenderingSettings;
  storage: StorageSettings;
}

interface GridSettings {
  enabled: boolean;
  size: number;
  majorEvery: number;
  color: string;
  majorColor: string;
}

interface RenderingSettings {
  cullingEnabled: boolean;
  showDebugBounds: boolean;
  devicePixelRatioLimit: number;
}
```

---

## 7. Manager Responsibilities

Managers should be created by `BoardRenderer`, which acts as the composition root. Avoid global singletons and circular imports.

### BoardManager

Owns canonical board state.

Responsibilities:

- load and initialize board state;
- expose read APIs for cards, connections, camera, and settings;
- apply low-level mutations requested by commands/managers;
- validate entity existence;
- emit board-level change events.

Should not directly perform Pixi rendering, process pointer events, or own undo stacks.

### CardManager

Responsibilities:

- create, update, delete cards;
- move cards;
- resize cards;
- update card content, color, image URL;
- compute card bounds;
- notify spatial index on bounds changes;
- mark card views dirty;
- notify connection system when moved/resized cards affect line endpoints.

Public user-facing mutations should generally execute commands through `HistoryManager`.

### ConnectionManager

Responsibilities:

- create and delete connections;
- resolve anchor points from card geometry;
- recompute affected connection endpoints;
- keep connection views dirty when endpoints change;
- maintain `connectionsByCardId: Map<CardId, Set<ConnectionId>>`.

The `connectionsByCardId` lookup is essential. Moving one card should not scan all 30,000 connections.

### SelectionManager

Responsibilities:

- single selection;
- multi-selection;
- toggle selection;
- clear selection;
- primary selection;
- rectangle selection;
- selected connection state;
- selection overlay invalidation.

Rectangle selection should query the spatial index rather than scanning all cards.

### HistoryManager

Responsibilities:

- execute commands;
- maintain undo and redo stacks;
- clear redo on new command;
- enforce history limit;
- support composite commands;
- batch high-frequency interactions into one command.

Example: dragging cards should preview movement during pointer move but commit one `MoveCardsCommand` at pointer up.

### RenderManager

Responsibilities:

- own Pixi display layers;
- manage render loop/update cycle;
- create, update, hide, recycle, and destroy display views;
- apply dirty updates;
- perform viewport culling;
- manage z-index sorting;
- update grid and overlays.

Domain managers should not know Pixi implementation details.

### InputManager

Responsibilities:

- capture Pixi pointer events;
- capture DOM wheel events;
- capture touch events;
- capture keyboard shortcuts;
- normalize input into `InputState`;
- delegate interaction behavior to tools.

Recommended flow:

```txt
InputManager → active Tool → managers / HistoryManager
```

### CameraManager

Responsibilities:

- own camera state;
- pan, zoom, fit board;
- screen/world conversion;
- apply transform to Pixi world layer;
- emit throttled camera change events if needed by React UI.

### ClipboardManager

Responsibilities:

- copy selected cards;
- copy only internal connections where both endpoints are selected;
- paste with generated IDs;
- preserve relative positions;
- rewire copied connections;
- duplicate selected content;
- execute paste/duplicate as composite commands.

### StorageManager

Responsibilities:

- serialize board state;
- save to LocalStorage;
- load from LocalStorage;
- run migrations;
- debounce saves;
- gracefully handle corrupt data.

Recommended key format:

```txt
renderer.board.{boardId}
```

### ViewportManager

Responsibilities:

- track canvas size;
- compute visible world bounds from camera;
- provide padded viewport bounds for culling;
- notify render/spatial systems when viewport changes.

### SpatialIndexManager

Responsibilities:

- maintain card spatial index;
- optionally maintain connection spatial index;
- support point queries for hit testing;
- support rectangle queries for selection and culling;
- update entries on create, move, resize, and delete.

---

## 8. State Management with StateDispatcher

The existing `StateDispatcher` is suitable for coarse manager-level state notifications.

Recommended uses:

- `selectionChanged`
- `historyChanged`
- `boardLoaded`
- `boardSaved`
- `settingsChanged`
- `cardCreated`
- `cardDeleted`
- `connectionCreated`
- `connectionDeleted`
- throttled `cameraChanged`

Avoid using it for:

- every pointer move;
- every animation frame;
- every temporary drag update;
- every Pixi display-object property update.

### Tradeoffs

Benefits:

- already available in the project;
- simple and typed;
- lightweight;
- avoids adding another state dependency.

Costs:

- mutable internal state requires discipline;
- no built-in immutable snapshots or devtools;
- high-frequency misuse can overwhelm subscribers.

Recommendation: use `StateDispatcher` as the manager notification mechanism, not as a replacement for specialized render/input state.

---

## 9. PixiJS Render Architecture

### Layer Model

Use stable Pixi containers:

```txt
stage
  root
    backgroundLayer
    worldLayer
      gridLayer
      connectionLayer
      cardLayer
      overlayLayer
    screenOverlayLayer
```

Layer responsibilities:

- `backgroundLayer`: fixed background fill if needed.
- `worldLayer`: receives camera transform; all world-space content lives here.
- `gridLayer`: infinite grid in world coordinates.
- `connectionLayer`: connections below cards.
- `cardLayer`: card bodies, text, and images.
- `overlayLayer`: selection outlines, resize handles, anchor points, drag previews.
- `screenOverlayLayer`: optional screen-space HUD/debug overlays.

### z-index Handling

Enable sorting only where needed:

```txt
cardLayer.sortableChildren = true
```

Cards use their domain `zIndex`. Connections render below cards because they are in a lower layer. Selection overlays render above cards because they are in `overlayLayer`.

### Render Loop

Recommended cycle:

```txt
Input events mutate state / mark dirty
        ↓
RenderManager schedules frame
        ↓
Pixi ticker update
        ↓
Apply camera transform if dirty
Update viewport if dirty
Run culling if viewport changed
Update dirty cards/connections/overlays
Render frame
```

Use Pixi's ticker consistently, but keep expensive work conditional through dirty flags and viewport checks.

---

## 10. Dirty Rectangles, Full Redraw, and Render Layers

### Dirty Rectangles

Dirty rectangles are not recommended for this project.

They are useful in some immediate-mode 2D canvas renderers, but with Pixi/WebGL they add complexity around transforms, antialiasing, text, images, overlaps, and scene graph batching. Pixi does not primarily optimize through user-managed dirty rectangles.

### Full Redraw

Pixi renders a full frame, but WebGL batching makes this efficient for active objects. However, rendering all 10,000 cards and 30,000 connections at all times would be too expensive.

### Recommended Approach

Use:

- render layers;
- persistent display objects for visible entities;
- dirty flags for changed entities;
- viewport culling;
- object pools;
- texture and text caching.

Recommendation:

```txt
Do not implement manual dirty rectangles.
Use Pixi scene graph + layers + dirty object updates + viewport culling.
```

---

## 11. Camera Design

Maintain two coordinate systems:

- **Screen space**: pixels relative to the canvas.
- **World space**: board coordinates independent of zoom/pan.

All domain entities use world coordinates.

### Required Operations

- Screen → World conversion.
- World → Screen conversion.
- Smooth pan.
- Smooth zoom centered on cursor.
- Fit board.

### Zoom Centered on Cursor

Algorithm:

1. Convert cursor screen position to world position before zoom.
2. Apply clamped new zoom.
3. Convert the same world position back to screen.
4. Adjust camera translation so that world point remains under the cursor.

This produces Miro/Figma-style zoom behavior.

### Fit Board

Algorithm:

1. Compute bounds of all cards.
2. Expand by padding.
3. Calculate zoom needed to fit bounds into viewport.
4. Clamp zoom.
5. Center camera on bounds.

---

## 12. Input System Design

Avoid complex logic directly inside Pixi event callbacks. Use normalized input and tools.

### Input Pipeline

```txt
DOM/Pixi event
  ↓
InputManager normalizes event
  ↓
InputState updates
  ↓
Active interaction tool handles behavior
  ↓
Managers / HistoryManager are called
```

### InputState Should Track

- active pointers;
- primary pointer;
- screen position;
- world position;
- pressed buttons;
- modifier keys;
- drag start position;
- drag delta;
- hovered entity;
- active tool.

### Tools

Recommended tools:

- `SelectTool`: click selection and toggle selection.
- `MoveCardsTool`: drag selected card groups.
- `RectangleSelectionTool`: drag empty board to select by rectangle.
- `PanTool`: space+drag, middle mouse, or touch pan.
- `ResizeCardTool`: resize selected/primary card from handles.
- `ConnectCardsTool`: drag from anchor to target card.

### Keyboard Shortcuts

Recommended shortcuts:

```txt
Cmd/Ctrl + Z         undo
Cmd/Ctrl + Shift + Z redo
Cmd/Ctrl + C         copy
Cmd/Ctrl + V         paste
Cmd/Ctrl + D         duplicate
Delete/Backspace     delete selection
Cmd/Ctrl + A         select all
Space + drag         pan
0                    fit board
+ / -                zoom in/out
Escape               cancel current tool / clear transient state
```

---

## 13. Hit Testing

Do not enable complex Pixi interaction on thousands of card display objects. Centralize hit testing.

Recommended hit test flow:

1. Convert pointer screen coordinate to world coordinate.
2. Query spatial index near the point.
3. Sort candidates by `zIndex` descending.
4. Perform precise bounds/handle/anchor tests.
5. Return topmost hit target.

Use Pixi/stage as the event capture surface, not every card.

---

## 14. Spatial Indexing

### QuadTree

Pros:

- good for uneven distributions;
- good for clustered data;
- can reduce query candidates significantly.

Cons:

- more complex to implement;
- updates on frequent move/resize are harder;
- large overlapping items can degrade behavior;
- tuning is more difficult.

### Uniform Grid

Pros:

- simple and fast;
- excellent for rectangular cards of similar sizes;
- easy updates on move/resize;
- easy viewport and rectangle queries;
- predictable behavior.

Cons:

- requires cell-size tuning;
- uneven distributions can create crowded cells;
- huge cards spanning many cells cost more.

### Recommendation

Start with **Uniform Grid** behind a `SpatialIndex` interface.

Recommended interface:

```ts
interface SpatialIndex<TId extends string> {
  insert(id: TId, bounds: Bounds): void;
  update(id: TId, bounds: Bounds): void;
  remove(id: TId): void;
  queryRect(rect: Rect): TId[];
  queryPoint(point: Point): TId[];
  clear(): void;
}
```

Recommended cell size: approximately average card width/height, commonly `256` or `512` world units.

---

## 15. Viewport Culling

### Card Culling

On camera or viewport changes:

1. Compute visible world rectangle.
2. Expand by padding, for example 500 world units.
3. Query spatial index for cards intersecting the padded viewport.
4. Ensure visible card views exist.
5. Hide, detach, or recycle non-visible card views.

### Connection Culling

MVP strategy:

- render connection if either endpoint card is visible;
- or render if connection bounds intersect padded viewport.

Later optimization:

- maintain a connection spatial index if 30,000 connections are still costly.

---

## 16. Render Batching and Memory Strategy

### Batching

Recommendations:

- reuse display objects through pools;
- avoid per-frame `Graphics` redraws unless geometry/style changed;
- update card positions via container transforms;
- redraw card background only when size, color, or selection state changes;
- use shared textures for common UI elements;
- keep card and connection views only for visible or near-visible entities.

### Text

Pixi `Text` can be expensive because it creates textures.

Staged recommendation:

1. MVP: use Pixi `Text` for visible cards only.
2. Optimization: cache text textures.
3. Later: use `BitmapText` or a custom text atlas for repeated styles.

### Images

Use `ImageTextureManager` to:

- cache textures by URL;
- reference-count visible uses;
- show placeholders while loading;
- handle load failures;
- enforce cache limits if needed.

### Memory Rule

Keep all domain entities in memory, but keep Pixi display objects only for visible or near-visible entities.

---

## 17. Undo / Redo Command System

Use command pattern.

Conceptual command interface:

```ts
interface Command {
  id: string;
  label: string;
  execute(context: CommandContext): void;
  undo(context: CommandContext): void;
  canMergeWith?(next: Command): boolean;
  mergeWith?(next: Command): Command;
}
```

### Required Commands

#### Move Cards

Stores card IDs plus before/after positions. Supports multiple cards in one command.

#### Resize Card

Stores card ID plus before/after rect.

#### Create Card

Stores full card snapshot. Undo deletes the card.

#### Delete Cards

Stores deleted card snapshots and deleted connection snapshots. Undo restores all affected data.

#### Connect Cards

Stores connection snapshot. Undo removes it.

#### Disconnect Cards

Stores connection snapshot. Undo restores it.

#### Composite Command

Groups multiple commands into one undoable operation.

Useful for:

- paste;
- duplicate;
- delete multiple cards and affected connections.

---

## 18. Clipboard Support

### Copy

When copying selected cards:

1. Collect selected cards.
2. Collect connections where both endpoints are selected.
3. Store relative positions based on selection bounds.
4. Store payload in `ClipboardManager`.

### Paste

When pasting:

1. Generate new card IDs.
2. Generate new connection IDs.
3. Create old-to-new card ID map.
4. Rewire copied connections.
5. Offset positions near cursor or viewport center.
6. Execute a composite create command.
7. Select newly pasted cards.

### Duplicate

Duplicate is copy + paste with deterministic offset, such as `{ x: 40, y: 40 }`, without requiring the browser clipboard.

---

## 19. LocalStorage Persistence

Persist a versioned board payload:

```ts
interface PersistedBoardPayload {
  schemaVersion: number;
  board: Board;
}
```

Save after:

- command execution;
- undo;
- redo;
- settings changes;
- debounced content edits.

Do not save on every pointer move or render frame.

Corrupt data handling:

- catch parse/validation errors;
- log warning;
- optionally back up corrupt raw value under a recovery key;
- initialize an empty board.

---

## 20. Rendering and Interaction Cycles

### Interaction Cycle

```txt
Pointer/wheel/keyboard event
  ↓
InputManager normalizes event
  ↓
Hit test through SpatialIndexManager if needed
  ↓
Active tool updates transient state or calls managers
  ↓
Managers mutate domain state or execute command
  ↓
Affected entities are marked dirty
  ↓
RenderManager updates visible views
```

### Update Cycle

```txt
Pixi ticker tick
  ↓
CameraManager applies transforms if dirty
  ↓
ViewportManager recalculates visible world rect if dirty
  ↓
RenderManager updates culling if viewport dirty
  ↓
RenderManager updates dirty card/connection views
  ↓
Selection overlays update
```

Coordinate conversion must be centralized in `CameraManager`. No other manager should implement independent screen/world math.

---

## 21. Dependency Strategy

`BoardRenderer` should create and wire managers. Managers should receive narrow interfaces, not concrete global singletons.

Recommended dependency direction:

```txt
BoardRenderer
  ├─ BoardManager
  ├─ CameraManager
  ├─ ViewportManager
  ├─ SpatialIndexManager
  ├─ RenderManager
  ├─ CardManager
  ├─ ConnectionManager
  ├─ SelectionManager
  ├─ HistoryManager
  ├─ ClipboardManager
  ├─ StorageManager
  └─ InputManager
```

Recommended narrow interfaces:

- `BoardReader`
- `BoardMutator`
- `RenderInvalidator`
- `SpatialIndexUpdater`
- `CommandExecutor`
- `CameraReader`
- `CameraController`

This keeps dependencies explicit and reduces circular coupling.

---

## 22. Design Decisions and Tradeoffs

### Pixi Scene Graph vs Manual Canvas Drawing

Use Pixi scene graph. It provides transforms, layering, GPU acceleration, image handling, text support, and batching. Manual canvas drawing would duplicate Pixi responsibilities and complicate interaction/rendering architecture.

### Centralized Hit Testing vs Per-Object Pixi Events

Use centralized hit testing. It scales better for thousands of cards and keeps input behavior separate from display objects.

### Uniform Grid vs QuadTree

Start with Uniform Grid because cards are rectangular, move/resize frequently, and need simple point/rectangle queries. Keep a `SpatialIndex` interface so QuadTree can be added later if profiling proves it necessary.

### StateDispatcher vs External Store

Use existing `StateDispatcher` for manager-level notifications. Avoid adding Redux/Zustand unless the broader app needs richer UI state tooling. Do not use it for high-frequency render/input internals.

### Dirty Rectangles vs Dirty Objects + Culling

Do not use manual dirty rectangles. Use Pixi scene graph, render layers, viewport culling, dirty display-object updates, and object pooling.

---

## 23. Implementation Roadmap

Each phase should be independently testable.

### Phase 1: Renderer Module Foundation

Deliverables:

- create folder structure;
- move or re-export existing `RenderStarter`;
- add `BoardRenderer` facade;
- define initial domain types.

Test criteria:

- React page mounts and destroys Pixi canvas;
- resize works;
- no obvious memory leak on remount.

### Phase 2: Camera and Infinite Grid

Deliverables:

- `CameraManager`;
- `ViewportManager`;
- screen/world conversion;
- pan;
- zoom centered on cursor;
- fit board;
- grid rendering.

Test criteria:

- smooth pan;
- cursor-centered wheel zoom;
- infinite-feeling grid.

### Phase 3: Board and Card Domain State

Deliverables:

- `BoardManager`;
- `CardManager`;
- card model;
- create/update/delete APIs;
- seeded demo cards.

Test criteria:

- cards exist in normalized board state;
- card bounds are correct in world coordinates.

### Phase 4: Card Rendering

Deliverables:

- `RenderManager`;
- render layers;
- `CardView`;
- card title/body/color rendering;
- optional image placeholder/loading.

Test criteria:

- cards render in Pixi, not HTML;
- world positions and camera transform are correct.

### Phase 5: Input Manager and Hit Testing

Deliverables:

- `InputManager`;
- pointer normalization;
- keyboard modifier tracking;
- centralized hit testing;
- `SpatialIndexManager` using Uniform Grid.

Test criteria:

- clicking cards identifies topmost card;
- empty-board clicks are detected;
- hit testing works after pan/zoom.

### Phase 6: Selection

Deliverables:

- `SelectionManager`;
- single selection;
- multi-selection;
- clear selection;
- selection outline rendering.

Test criteria:

- click selects one card;
- modifier-click toggles selection;
- selection visuals follow camera and card movement.

### Phase 7: Drag and Move Cards

Deliverables:

- `MoveCardsTool`;
- drag threshold;
- selected-group movement;
- dirty card updates;
- spatial index updates.

Test criteria:

- dragged card moves;
- dragging one selected card moves all selected cards;
- hit testing remains correct after move.

### Phase 8: Command History Basics

Deliverables:

- `HistoryManager`;
- `Command` interface;
- `MoveCardsCommand`;
- undo/redo shortcuts.

Test criteria:

- drag creates one undo command;
- undo restores previous positions;
- redo reapplies movement.

### Phase 9: Resize Cards

Deliverables:

- resize handles;
- `ResizeCardTool`;
- `ResizeCardCommand`;
- minimum card size rules.

Test criteria:

- selected card resizes;
- text/background update;
- undo/redo resize works.

### Phase 10: Connections

Deliverables:

- `ConnectionManager`;
- `ConnectionView`;
- center anchors;
- create/delete connection commands;
- affected connection updates on card move/resize.

Test criteria:

- cards can be connected;
- connection renders below cards;
- moving/resizing cards updates lines;
- undo/redo connect/disconnect works.

### Phase 11: Rectangle Selection

Deliverables:

- `RectangleSelectionTool`;
- selection rectangle overlay;
- spatial-index rectangle query;
- add/replace selection modes.

Test criteria:

- dragging empty board creates selection rectangle;
- intersecting cards become selected;
- works with thousands of cards.

### Phase 12: Clipboard

Deliverables:

- `ClipboardManager`;
- copy;
- paste;
- duplicate;
- composite commands;
- internal connection remapping.

Test criteria:

- selected cards duplicate with new IDs;
- internal connections duplicate and rewire;
- undo removes pasted entities.

### Phase 13: LocalStorage Persistence

Deliverables:

- `StorageManager`;
- serializers;
- migrations;
- debounced save;
- load on startup.

Test criteria:

- board survives refresh;
- corrupt storage does not crash app;
- save does not occur on every drag frame.

### Phase 14: Performance Pass

Deliverables:

- viewport culling;
- display object pooling;
- connection culling;
- text/image caching strategy;
- optional debug metrics overlay.

Test criteria:

- 10,000-card synthetic board remains navigable;
- 30,000-connection synthetic board remains usable with culling;
- visible object counts and frame timing can be inspected.

### Phase 15: MVP Polish

Deliverables:

- fit board shortcut;
- delete selection;
- basic React toolbar/instructions panel;
- settings defaults;
- renderer error handling.

Test criteria:

- full MVP flow works: create, move, resize, connect, select multiple, copy/paste, undo/redo, refresh/restore.

---

## 24. Recommended MVP Scope

Implement first:

- infinite grid;
- pan, zoom, fit board;
- Pixi-rendered cards with title, text, color, optional image URL;
- move, resize, select, multi-select, rectangle-select;
- center-to-center connections;
- command-based undo/redo;
- copy, paste, duplicate;
- LocalStorage persistence;
- Uniform Grid spatial index;
- viewport culling for cards and basic culling for connections.

Defer:

- advanced edge anchors;
- arrowheads;
- orthogonal or Bezier routing;
- collaboration;
- rich text editing;
- media upload;
- minimap;
- grouping;
- advanced text virtualization.

---

## 25. Final Recommendation

The best architecture for this project is a manager-driven PixiJS scene graph with normalized domain state, explicit camera abstraction, centralized input tools, command-based history, LocalStorage persistence, Uniform Grid spatial indexing, viewport culling, and dirty display-object updates.

React should host the renderer and provide surrounding UI, while PixiJS should own all board visuals. This approach is maintainable, scalable, and well-aligned with PixiJS performance characteristics.