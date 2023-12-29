import { Bindings } from './options';

export interface FormItem<T> {
  value: T;
  subscribe: (callback: (item: FormItem<T>) => void) => void;
  bindings?: Bindings;
  required: boolean;
  invalid: boolean;
  error: string[];
}

export type FormItemConstructor<T> = { new (): FormItem<T[keyof T]> };
