import type { Form, FormOptions, FormOptionsChain, FormOptionsChainConstructor, ValidationMap, WithBindErrorOption, WithValidationMessageOption } from '../../types';

export const t = <T, O>(defaultValue: T | undefined = undefined): FormOptionsChain<T, O> => {
    const options: FormOptions<T, O> = {
        dependents: {}
    };
    options.value = defaultValue;

    const Premise = function(this: FormOptionsChain<T, O>) {
        this.value = (value: T) => {
            options.value = value;
            return this;
        }

        this.required = (message?: string) => {
            options.required = true;

            if (!options.validate)
                options.validate = [];

            const validationMap: ValidationMap<T, O> = { fn: value => !!value };

            if (message)
                validationMap.message = message;
            
            options.validate.push(validationMap)

            return this;
        }

        this.validate = (fn, deps) => {

            if (!options.validate)
                options.validate = [];

            const validationMap: ValidationMap<T, O> = { fn: (value, target) => !value || fn(value, target), deps }
            options.validate.push(validationMap);

            const withValidationMessage: WithValidationMessageOption<T, O> = {
                withMessage: (message: string) => {
                    if (!options.validate)
                        options.validate = [];

                    const validationIndex = options.validate.indexOf(validationMap);
                    validationMap.message = message;
                    options.validate[validationIndex] = validationMap;

                    return this;
                }
            }

            return Object.assign(this, withValidationMessage);
        }

        this.bind = selector => {
            if (!options.bindings)
                options.bindings = {}

            let element = document.querySelector(selector);

            if (!element)
                throw new Error(`Element with selector ${selector} not found`)

            if (element.tagName != "INPUT")
                element = element.querySelector("input");

            if (!element)
                throw new Error(`Element with selector ${selector} don't have a inner input`)

            options.bindings.input = element as HTMLInputElement;

            const withBindError: WithBindErrorOption<T, O> = {
                withErrorOn: selector => {
                    if (!options.bindings)
                        options.bindings = {}

                    const element = document.querySelector(selector);

                    if (!element)
                        throw new Error(`Element with selector ${selector} not found`)

                    options.bindings.error = element as HTMLElement;

                    return this;
                }
            }

            return Object.assign(this, withBindError);
        }

        this.transform = fn => {
            options.transform = fn
            return this;
        }

    } as unknown as FormOptionsChainConstructor<T, O>

    Premise.prototype.options = options;

    return new Premise();
}

export const string = <O = undefined>() => t<string, Form<O>>('');
export const number = <O = undefined>() => t<number, Form<O>>();
export const boolean = <O = undefined>() => t<boolean, Form<O>>(false);
export const date = <O = undefined>() => t<Date, Form<O>>();
export const array = <T, O = undefined>() => t<T[], Form<O>>([]);