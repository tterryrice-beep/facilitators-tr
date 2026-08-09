export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${String(x)}`);
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}
