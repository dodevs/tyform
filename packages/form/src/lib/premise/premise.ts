import { FormOptions, FormOptionsChain, FormOptionsChainConstructor, ValidationMap, WithBindErrorOption, WithValidationMessageOption } from '../../types';

export const t = <T>(defaultValue: T | undefined = undefined): FormOptionsChain<T> => {
    const options: FormOptions<T> = {};
    options.value = defaultValue;

    const Premise = function(this: FormOptionsChain<T>) {
        this.value = (value: T) => {
            options.value = value;
            return this;
        }

        this.required = (message?: string) => {
            options.required = true;

            if (!options.validate)
                options.validate = [];

            const validationMap: ValidationMap<T> = { fn: value => !!value };

            if (message)
                validationMap.message = message;
            
            options.validate.push(validationMap)

            return this;
        }

        this.validate = fn => {

            if (!options.validate)
                options.validate = [];

            const validationMap: ValidationMap<T> = { fn: value => !value || fn(value) }
            options.validate.push(validationMap);

            const withValidationMessage: WithValidationMessageOption<T> = {
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

            const withBindError: WithBindErrorOption<T> = {
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
            options.transform = fn;
            return this;
        }

    } as unknown as FormOptionsChainConstructor<T>

    Premise.prototype.options = options;

    return new Premise();
}

export const string = () => t<string>('');
export const number = () => t<number>();
export const boolean = () => t<boolean>(false);
export const date = () => t<Date>();
export const array = <T>() => t<T[]>([]);