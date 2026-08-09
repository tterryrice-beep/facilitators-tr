import type { BoardSettings } from '../types';

export const DEFAULT_BOARD_SETTINGS: BoardSettings = {
  grid: {
    enabled: true,
    size: 50,
    majorEvery: 5,
    color: 'rgba(255, 255, 255, 0.08)',
    majorColor: 'rgba(255, 255, 255, 0.15)',
  },
  interaction: {
    dragThreshold: 4,
    minCardWidth: 100,
    minCardHeight: 80,
  },
  rendering: {
    cullingEnabled: true,
    showDebugBounds: false,
    devicePixelRatioLimit: 2,
    backgroundColor: '#1a1a2e',
  },
  storage: {
    enabled: true,
    debounceMs: 500,
    keyPrefix: 'renderer.board.',
  },
};

export const DEFAULT_CAMERA_STATE = {
  x: 0,
  y: 0,
  zoom: 1,
  minZoom: 0.05,
  maxZoom: 5,
};

export const VIEWPORT_CULLING_PADDING = 500;
export const HIST0RY_MAX_SIZE = 100;
export const SPATIAL_CELL_SIZE = 256;
export const PASTE_OFFSET = { x: 40, y: 40 };
export const ARROW_KEY_PAN_SPEED = 50;