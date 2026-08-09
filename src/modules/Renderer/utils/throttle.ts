export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  delayMs: number,
): T {
  let lastTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const throttled = function (this: any, ...args: any[]) {
    const now = Date.now();
    const remaining = delayMs - (now - lastTime);
    if (remaining <= 0) {
      lastTime = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastTime = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  } as unknown as T;

  return throttled;
}
