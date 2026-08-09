// Renderer Module - Infinite Canvas Card Board
// Public API

// Core
export { BoardRenderer } from './core/BoardRenderer';
export type { BoardRendererOptions } from './core/BoardRenderer';
export { RenderStarter } from './core/RenderStarter';

// Types (domain)
export type {
  BoardId, CardId, ConnectionId,
  Board, BoardMetadata,
  Card, Connection,
  ConnectionAnchor, ConnectionStyle,
  CameraState, SelectionState,
  BoardSettings, GridSettings,
  InteractionSettings, RenderingSettings, StorageSettings,
  Point, Size, Rect, Bounds,
  ClipboardPayload,
} from './types';

// Camera
export { Camera } from './camera/Camera';
export { CameraManager } from './camera/CameraManager';

// Managers (for advanced usage)
export { BoardManager } from './managers/BoardManager';
export { CardManager } from './managers/CardManager';
export { ConnectionManager } from './managers/ConnectionManager';
export { SelectionManager } from './managers/SelectionManager';
export { HistoryManager } from './managers/HistoryManager';
export { ClipboardManager } from './managers/ClipboardManager';
export { StorageManager } from './managers/StorageManager';
export { SpatialIndexManager } from './managers/SpatialIndexManager';

// Spatial
export { UniformGridIndex } from './spatial/UniformGridIndex';
export type { SpatialIndex } from './spatial/SpatialIndex';

// Commands
export {
  MoveCardsCommand,
  ResizeCardCommand,
  CreateCardCommand,
  DeleteCardsCommand,
  ConnectCardsCommand,
  DisconnectCardsCommand,
  CompositeCommand,
} from './commands';
export type { Command, CommandContext } from './commands/Command';
