import type {
  Form,
  FormConstructor,
  FormConfig,
  FormBuilder,
  FormBuilderConstructor,
  FormItem,
  FormItemConstructor,
  FormOptions,
  IfRequired,
} from '../../types';

export function builder<T>(config?: FormConfig<T>): FormBuilder<T> {
  const FormBuilder = function (this: FormBuilder<T>, config?: FormConfig<T>) {
    let formEmitter: (values: Form<T>) => void;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const Form = function (this: Form<T>) {} as unknown as FormConstructor<T>;

    const getOptions = (formKey: keyof T) => {
      let options!: FormOptions<T[keyof T], Form<T>>;

      const keyOptions = config?.[formKey as keyof T];
      if (keyOptions != undefined)
        options = Reflect.get(keyOptions, 'options') as FormOptions<
          T[keyof T],
          Form<T>
        >;

      return options;
    };

    const formHandler: ProxyHandler<Form<T>> = {
      get(formTarget, formKey) {
        if (formKey in formTarget) {
          return formTarget[formKey as keyof T];
        }

        const options = getOptions(formKey as keyof T);

        const isRequired = !!options?.required;

        const itemEmitters: ((item: FormItem<T[keyof T]>) => void)[] = [];

        const FormItem = function (
          this: FormItem<IfRequired<T[keyof T], typeof isRequired>>
        ) {
          this.value = options?.value;
          this.bindings = options?.bindings;
          this.required = isRequired;
          this.invalid = false;
          this.error = [];
          this.subscribe = (callback: (item: FormItem<T[keyof T]>) => void) => {
            itemEmitters.push(callback);
          };
        } as unknown as FormItemConstructor<T>;

        const item = new FormItem();

        const itemHandler: ProxyHandler<FormItem<T[keyof T]>> = {
          get(itemTarget, itemKey) {
            return Reflect.get(itemTarget, itemKey);
          },

          set(itemTarget, prop, value) {
            if (prop === 'value') {
              itemTarget.value =
                value && options?.transform ? options.transform(value) : value;

              if (options?.validate?.length && options?.validate.length > 0) {
                const result = options.validate.reduce((acc, cur) => {
                  acc.push([
                    !cur.fn(itemTarget.value, formTarget),
                    cur.message,
                  ]);
                  return acc;
                }, [] as [boolean, string?][]);

                itemTarget.invalid = result.reduce(
                  (acc, cur) => acc || cur[0],
                  false
                );
                itemTarget.error = result
                  .filter((r) => r[0] && r[1])
                  .map((r) => r[1]) as string[];
              }

              if (itemTarget.bindings?.input) {
                itemTarget.bindings.input.value = itemTarget.value as string;
                itemTarget.bindings.input.classList.toggle(
                  'invalid',
                  itemTarget.invalid
                );
              }

              if (itemTarget.bindings?.error) {
                itemTarget.bindings.error.innerText =
                  itemTarget.error.join(', ');
              }

              if (itemEmitters.length) {
                itemEmitters.forEach((emitter) => emitter(itemTarget));
              }

              if (formEmitter != undefined) {
                formEmitter(formTarget);
              }
            } else {
              Reflect.set(itemTarget, prop, value);
            }

            return true;
          },
        };

        const proxyItem = new Proxy(item, itemHandler);
        formTarget[formKey as keyof T] = proxyItem;

        options?.validate
          ?.reduce((acc, cur) => acc.concat(cur.deps || []), [] as (keyof T)[])
          .forEach((dep) => {
            form?.[dep].subscribe(() => {
              formTarget[formKey as keyof T].value =
                form[formKey as keyof T].value;
            });
          });

        return formTarget[formKey as keyof T];
      },

      set(target, prop, value) {
        target[prop as keyof T] = value;
        return true;
      },
    };

    const form = new Proxy(new Form(), formHandler);

    if (config) {
      Object.keys(config).forEach((key) => {
        const options = getOptions(key as keyof T);
        const input = options.bindings?.input;
        if (input) {
          const setFormFromInput = () =>
            (form[key as keyof T].value = (
              input.type === 'checkbox' ? input.checked : input.value
            ) as T[keyof T]);

          if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = form[key as keyof T].value as boolean;
            input.addEventListener('change', setFormFromInput);
          } else {
            input.value = form[key as keyof T].value as string;
            input.addEventListener('input', setFormFromInput);
          }
        }
      });
    }

    this.init = (values) => {
      for (const [key, value] of Object.entries(values)) {
        form[key as keyof T].value = value as T[keyof T];
      }
      return this;
    };

    this.values = () => {
      return Object.keys(form).reduce((acc, cur) => {
        acc[cur as keyof T] = form[cur as keyof T].value;
        return acc;
      }, {} as T);
    };

    this.subscribe = (callback) => {
      formEmitter = callback;
      return this;
    };

    this.build = () => {
      return form;
    };
  } as unknown as FormBuilderConstructor<T>;

  return new FormBuilder(config);
}
