import { describe, it, expect, vi } from 'vitest';
import { builder } from '.';
import { string } from '../premise';
import { Form } from '../../types';

interface Contact {
  Name: string;
  Phone: string;
  Email: string;
}

describe('builder', () => {
  it('should create a form', () => {
    const form = builder<Contact>().build();
    expect(form).toBeDefined();
  });

  it('should be initialized', () => {
    const initValues = {
      Name: 'João',
      Email: 'joao@email.com',
      Phone: '+5527998765432',
    };

    const contactBuilder = builder<Contact>().init(initValues);

    const values = contactBuilder.values();

    expect(values).toEqual(initValues);
  });

  it('Values should be transformed', () => {
    const initValues = {
      Name: 'João',
      Email: 'joao@email.com',
      Phone: '+5527998765432',
    };

    const contactBuilder = builder<Contact>({
      Name: string().transform((value) => value.toUpperCase()),
    }).init(initValues);

    const values = contactBuilder.values();

    expect(values).toEqual({
      Name: 'JOÃO',
      Email: initValues.Email,
      Phone: initValues.Phone,
    });
  });

  it('Value should be valid', () => {
    const initValues = {
      Name: 'João',
      Email: 'joao@email.com',
      Phone: '+5527998765432',
    };

    const contactBuilder = builder<Contact>({
      Email: string().validate((email) => /(.+)@(.+)/.test(email)),
    }).init(initValues);

    const form = contactBuilder.build();

    expect(form.Email.invalid).toBe(false);
  });

  it('Value should be invalid', () => {
    const initValues = {
      Name: 'João',
      Email: 'joao.com',
      Phone: '+5527998765432',
    };

    const contactBuilder = builder<Contact>({
      Email: string().validate((email) => /(.+)@(.+)/.test(email)),
    }).init(initValues);

    const form = contactBuilder.build();

    expect(form.Email.invalid).toBe(true);
  });

  it('Validation dependencies should trigger a new validation', () => {
    const contactBuilder = builder<Contact>({
      Email: string<Contact>().validate(
        (value, target) => {
          if (value && target?.Name.value)
            return value.includes(target.Name.value);
          return true;
        },
        ['Name']
      ),
    });

    const form = contactBuilder.build();

    expect(form.Email.invalid).toBe(false);
    form.Email.value = 'joão@email.com';
    expect(form.Email.invalid).toBe(false);
    form.Name.value = 'john';
    expect(form.Email.invalid).toBe(true);
    form.Name.value = 'joão';
    expect(form.Email.invalid).toBe(false);
  });

  it('Invalid form item should have errors', () => {
    const form = builder<Contact>({
      Email: string()
        .validate((email) => /(.+)@(.+)/.test(email))
        .withMessage('Invalid email')
        .required(),
    }).build();

    form.Email.value = 'test.com';
    expect(form.Email.error[0]).toContain('Invalid email');
  });

  it('Error message should be removed', () => {
    const form = builder<Contact>({
      Email: string()
        .validate((email) => /(.+)@(.+)/.test(email))
        .withMessage('Invalid email')
        .required(),
    }).build();

    form.Email.value = 'test.com';

    expect(form.Email.invalid).toBeTruthy();
    expect(form.Email.error[0]).toBe('Invalid email');

    form.Email.value = 'test@test.com';
    expect(form.Email.invalid).toBeFalsy();
    expect(form.Email.error).toHaveLength(0);
  });

  it('Options value should not emit changes', () => {
    const callback = vi.fn((values) => values);

    const contactBuilder = builder<Contact>({
      Name: string().value('José'),
    });

    contactBuilder.subscribe(callback);

    expect(callback).toBeCalledTimes(0);
  });

  it('Init should not emit changes', () => {
    const callback = vi.fn((values) => values);

    const contactBuilder = builder<Contact>().init({
      Name: 'Nick',
      Email: 'nick@email.com',
    });

    contactBuilder.subscribe(callback);

    expect(callback).toBeCalledTimes(0);
  });

  it('Form value should emit changes', () => {
    const callback = vi.fn((values) => values);

    const contactForm = builder<Contact>().subscribe(callback).build();

    contactForm.Name.value = 'Nathan';
    contactForm.Email.value = 'nathan@email.com';

    expect(callback).toBeCalledTimes(2);
  });

  it('Emitted form should have same value', () => {
    const name = 'Nathan';
    const callback = (form: Form<Contact>) => {
      expect(form.Name.value).toBe(name);
    };

    const contactForm = builder<Contact>({
      Name: string().required('Name is required'),
    })
      .subscribe(callback)
      .build();

    contactForm.Name.value = name;
  });

  it('Form item should emit changes', () => {
    const callback = vi.fn((item) => item);

    const contactForm = builder<Contact>().build();

    contactForm.Name.subscribe(callback);
    contactForm.Name.value = 'Nathan';

    expect(callback).toBeCalled();
  });

  it('Builder values should return current state', () => {
    const contactBuilder = builder<Contact>();

    const contactForm = contactBuilder.build();
    contactForm.Name.value = 'Nathan';

    const values = contactBuilder.values();
    expect(values.Name).toBe('Nathan');
  });
});
