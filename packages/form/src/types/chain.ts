type ValidationFn<T> = (value: T, message?: string) => boolean;

type ValidationMessageOption<T> = (message: string) => FormOptionsChain<T>;
type BindErrorOption<T> = (selector: string) => FormOptionsChain<T>;

type ValueOption<T> = (value: T) => FormOptionsChain<T>;
type RequiredOption<T> = (message?: string) => FormOptionsChain<T>;
type ValidateOption<T> = (fn: ValidationFn<T>)  => FormOptionsChain<T> & WithValidationMessageOption<T>;
type TransformOption<T> = (fn: (value: T) => T) => FormOptionsChain<T>;
type BindOption<T> = (selector: string) => FormOptionsChain<T> & WithBindErrorOption<T>;

export interface WithBindErrorOption<T> {
    withErrorOn: BindErrorOption<T>
}

export interface WithValidationMessageOption<T> {
    withMessage: ValidationMessageOption<T>
}

export interface FormOptionsChain<T> {
    value: ValueOption<T>
    required: RequiredOption<T>
    validate: ValidateOption<T>
    transform: TransformOption<T>
    bind: BindOption<T>
}

export type FormOptionsChainConstructor<T> = {new (): FormOptionsChain<T>}