import type { FormItem } from './item';
import type { FormOptionsChain } from './chain';

export type Form<T> = {
  [P in keyof T]: FormItem<T[P]>;
};

export type FormConstructor<T> = { new (): Form<T> };

export interface FormBuilder<T> {
  init: (values: Partial<T>) => FormBuilder<T>;
  values: () => Partial<T>;
  subscribe: (callback: (values: Form<T>) => void) => FormBuilder<T>;
  build: () => Form<T>;
}

export type FormBuilderConstructor<T> = {
  new (config?: FormConfig<T>): FormBuilder<T>;
};

export type FormConfig<T> = {
  [P in keyof T]+?: FormOptionsChain<T[P], Form<T> | undefined>;
};
