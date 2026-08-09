export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delayMs: number,
): T {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, delayMs);
  } as unknown as T;

  return debounced;
}
