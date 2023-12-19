export type ValidationMap<T, O> = { fn: (value: T, target: O) => boolean, deps?: (keyof O)[], message?: string }

type Validate<T, O> = ValidationMap<T, O>[];
type Transform<T> = (value: T) => T;
export type Bindings = {
    input?: HTMLInputElement
    error?: HTMLElement
}
type Dependents<O> = {
    validate?: (keyof O)[]
}

export interface FormOptions<T, O> {
    value?: T
    required?: boolean
    validate?: Validate<T, O>
    transform?: Transform<T>
    bindings?: Bindings
    dependents?: Dependents<O>
}