// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { html, render } from 'lit';
import { builder } from './builder';
import { string } from '../premise/premise';

interface Contact {
  Name: string;
  Phone: string;
  Email: string;
}

describe('builder bind', () => {
  const PHONE_RGX = /(\d{2})(\d)(\d{4})(\d{4})/;

  const formHtml = html`
    <form id="myForm">
      <label>
        Name:
        <input type="text" id="name-input" />
        <small></small>
      </label>
      <label>
        Phone:
        <input type="tel" id="phone-input" />
        <small></small>
      </label>
      <label>
        Email:
        <input type="email" id="email-input" />
        <small></small>
      </label>
    </form>
  `;

  function dispatchInput(element: HTMLInputElement | undefined, value: string) {
    if (element) {
      element.value = value;
      element.dispatchEvent(
        new Event('input', { bubbles: true, cancelable: true })
      );
    }
  }

  beforeEach(() => {
    render(formHtml, document.body);
  });

  it('should bind inputs', () => {
    const form = builder<Contact>({
      Name: string().bind('#name-input'),
      Phone: string().bind('#phone-input'),
      Email: string().bind('#email-input'),
    }).build();

    const nameInput = document.querySelector('#name-input') as HTMLInputElement;
    const phoneInput = document.querySelector(
      '#phone-input'
    ) as HTMLInputElement;
    const emailInput = document.querySelector(
      '#email-input'
    ) as HTMLInputElement;

    expect(nameInput.oninput).toBeDefined();
    expect(form.Name.bindings?.input).toBeDefined();

    expect(phoneInput.oninput).toBeDefined();
    expect(form.Phone.bindings?.input).toBeDefined();

    expect(emailInput.oninput).toBeDefined();
    expect(form.Email.bindings?.input).toBeDefined();
  });

  it('input should update form item value', () => {
    const form = builder<Contact>({
      Name: string().bind('#name-input'),
    }).build();

    const nameInput = document.querySelector('#name-input') as HTMLInputElement;

    const name = 'João';
    dispatchInput(nameInput, name);
    expect(form.Name.value).toBe(name);
  });

  it('input value should be transformed', () => {
    const form = builder<Contact>({
      Name: string()
        .bind('#name-input')
        .transform((value) => value.toUpperCase()),
    }).build();

    const nameInput = document.querySelector('#name-input') as HTMLInputElement;

    const name = 'joão';
    dispatchInput(nameInput, name);
    expect(nameInput.value).toBe('JOÃO');
    expect(form.Name.value).toBe('JOÃO');
  });

  it('Required input should have invalid class', () => {
    builder<Contact>({
      Name: string().bind('#name-input').required(),
    });

    const nameInput = document.querySelector('#name-input') as HTMLInputElement;

    dispatchInput(nameInput, '');

    expect(nameInput?.classList.value).toContain('invalid');
  });

  it('Input with validation should have invalid class', () => {
    builder<Contact>({
      Phone: string()
        .bind('#phone-input')
        .validate((value) => PHONE_RGX.test(value)),
    }).build();

    const phoneInput = document.querySelector(
      '#phone-input'
    ) as HTMLInputElement;
    dispatchInput(phoneInput, '998765432');

    expect(phoneInput.classList.value).toContain('invalid');
  });

  it('Input with validation should remove invalid class after correct value', () => {
    builder<Contact>({
      Phone: string()
        .bind('#phone-input')
        .validate((value) => PHONE_RGX.test(value)),
    }).build();

    const phoneInput = document.querySelector(
      '#phone-input'
    ) as HTMLInputElement;
    dispatchInput(phoneInput, '998765432');

    expect(phoneInput.classList.value).toContain('invalid');

    dispatchInput(phoneInput, '27998765432');
    expect(phoneInput.classList.value).toBe('');
  });
});
