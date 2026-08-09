export interface Disposable {
  dispose(): void;
}

export function isDisposable(obj: unknown): obj is Disposable {
  return typeof obj === 'object' && obj !== null && 'dispose' in obj && typeof (obj as Disposable).dispose === 'function';
}