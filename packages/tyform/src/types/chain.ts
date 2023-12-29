type ValidationFn<T, O> = (value: T, target?: O) => boolean;

type ValidationMessageOption<T, O> = (
  message: string
) => FormOptionsChain<T, O>;
type BindErrorOption<T, O> = (selector: string) => FormOptionsChain<T, O>;

type ValueOption<T, O> = (value: T) => FormOptionsChain<T, O>;
type RequiredOption<T, O> = (message?: string) => FormOptionsChain<T, O>;
type ValidateOption<T, O> = (
  fn: ValidationFn<T, O>,
  deps?: (keyof O)[]
) => FormOptionsChain<T, O> & WithValidationMessageOption<T, O>;
type TransformOption<T, O> = (fn: (value: T) => T) => FormOptionsChain<T, O>;
type BindOption<T, O> = (
  selector: string
) => FormOptionsChain<T, O> & WithBindErrorOption<T, O>;

export interface WithBindErrorOption<T, O> {
  withErrorOn: BindErrorOption<T, O>;
}

export interface WithValidationMessageOption<T, O> {
  withMessage: ValidationMessageOption<T, O>;
}

export interface FormOptionsChain<T, O> {
  value: ValueOption<T, O>;
  required: RequiredOption<T, O>;
  validate: ValidateOption<T, O>;
  transform: TransformOption<T, O>;
  bind: BindOption<T, O>;
}

export type FormOptionsChainConstructor<T, O> = {
  new (): FormOptionsChain<T, O>;
};
