export type ValidationMap<T> = { fn: FnInput<T, boolean>, message?: string }

type FnInput<T, R> = (value: T) => R;
type Validate<T> = ValidationMap<T>[];
type Transform<T> = FnInput<T,T>;
export type Bindings = {
    input?: HTMLInputElement
    error?: HTMLElement
}

export interface FormOptions<T> {
    value?: T
    required?: boolean
    validate?: Validate<T>
    transform?: Transform<T>
    bindings?: Bindings
}