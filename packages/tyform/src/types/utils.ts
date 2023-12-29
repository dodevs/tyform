export type IfRequired<T, C extends boolean> = C extends true
  ? T
  : T | undefined;
