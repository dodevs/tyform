import { FormOptions, FormOptionsChain } from "../../types";
import { t } from './premise';
import { describe, it, expect} from 'vitest';

function GetOptions<T, O = undefined>(chain: FormOptionsChain<T, O>): FormOptions<T, O> {
    const options = Reflect.get(chain, 'options') as FormOptions<T, O>;
    return options;
}

describe('form item options', () => {
    it('options should be empty object', () => {
        const chain = t();
        const options = GetOptions(chain);

        expect(options).toEqual({
            dependents: {}
        })
    });

    it('should have required option', () => {
        const chain = t().required();
        const options = GetOptions(chain);

        expect(options.required).toBeDefined()
    });

    it('should have value option', () => {
        const chain = t().value(null);
        const options = GetOptions(chain);

        expect(options.value).toBeDefined();
    })

    it('should have transform option', () => {
        const chain = t().transform(v => v);
        const options = GetOptions(chain);

        expect(options.transform).toBeDefined();
    })

    it('should have validate option', () => {
        const chain = t().validate(() => true);
        const options = GetOptions(chain);

        expect(options.validate).toBeDefined();
    })

    it('should have error message', () => {
        const chain = t().validate(() => false).withMessage("Fail");
        const options = GetOptions(chain);

        expect(options.validate?.[0].message).toBe("Fail")
    })

    it('should have dependencies', () => {
        const chain = t<string, { Teste: string, Teste1: string }>().validate(() => true, ['Teste1']);
        const options = GetOptions(chain);

        expect(options.validate?.[0].deps).toStrictEqual(['Teste1'])
    })

    it('Should have correlational error messages', () => {
        const chain = t()
            .validate(() => true).withMessage('Fail 1')
            .required()
            .validate(() => false).withMessage('Fail 2');

        const options = GetOptions(chain);
        expect(options.validate?.length).toBe(3);
        expect(options.validate?.[0].message).toBe('Fail 1');
        expect(options.validate?.[1].message).toBe(undefined)
        expect(options.validate?.[2].message).toBe('Fail 2');

    })

    it('should have complete options', () => {
        const transformFn = (v: unknown) => v;
        const validateFn = () => true;

        const chain = t()
            .required()
            .value(null)
            .transform(transformFn)
            .validate(validateFn);
        const options = GetOptions(chain);

        expect(options.required).toBe(true);
        expect(options.value).toBe(null);
        expect(options.transform).toBe(transformFn);
        expect(options.validate).toHaveLength(2);
    })

    it('Should keep value', () => {
        const chain = t().value('teste');
        const options = GetOptions(chain);

        expect(options.value).toBe('teste');
    })

    it('Should set as required', () => {
        const chain = t().required();
        const options = GetOptions(chain);

        expect(options.required).toBe(true);
    })
})