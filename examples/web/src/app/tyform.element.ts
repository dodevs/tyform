import { builder as tyform, string } from 'tyform';
import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import './tyerror/tyerror.element';
import type { Form, FormItem } from 'packages/form/src/types';

interface Contact {
  Name: string;
  Phone: string;
  Email: string;
}

@customElement('ty-form')
export class TyForm extends LitElement {

  private phone_rgx = /(\d{2})(\d)(\d{4})(\d{4})/;
  private email_rgx = /([\w_.]+)@(\w+\.\w+)/;

  static styles = css`
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;

      max-width: 500px;
    }

    label {
      display: flex;
      flex-direction: column;
    }

    input {
      margin-top: 5px;
      border-radius: 5px;

      &.invalid {
        border-width: 0.1em;
        border-style: solid;
        border-color: #ff4b4b
      }
    }

    button {
      width: fit-content;
    }
  `;

  @state()
  private invalid = false;

  @state()
  private form!: Form<Contact>;

  render() {
    const builder = tyform<Contact>({
      Name: string()
        .required("Name is required")
        .validate(value => value.length >= 10).withMessage('Min length is 10')
        .validate(value => value.trim().split(' ').length > 1).withMessage('Lastname is required')
        .transform(value => value.toUpperCase()),
      Phone: string()
        .validate(value => this.phone_rgx.test(value)).withMessage("Phone format is invalid"),
      Email: string()
        .validate(value => this.email_rgx.test(value)).withMessage("Email format is invalid")
    }).init({
      Name: 'João Miguel',
      Phone: '27998765432',
      Email: 'jao.miguel@hotmail.com'
    })

    this.form = builder.build();

    builder.subscribe(form => {
      this.invalid = Object.values(form).reduce((acc, cur) => acc || cur.invalid, false);
    })

    const Submit = (e: Event) => {
      e.preventDefault();
      const values = builder.values();
      console.log(values)
    }
    
    const HandleInput = (item: FormItem<unknown>) => {
      return (e: InputEvent) => {
        item.value = (e.target as HTMLInputElement).value
      }
    }

    return html`
      <form>
        <label>
          Name:
          <input class="${classMap({ invalid: this.form.Name.invalid })}" type="text" .value=${this.form.Name.value} @input=${HandleInput(this.form.Name)}>
          <ty-error .item=${this.form.Name}></ty-error>
        </label>

        <label>
          Phone:
          <input class="${classMap({ invalid: this.form.Phone.invalid })}" type="text" .value=${this.form.Phone.value} @input=${HandleInput(this.form.Phone)}>
          <ty-error .item=${this.form.Phone}></ty-error>
        </label>

        <label>
          Email:
          <input class="${classMap({ invalid: this.form.Email.invalid })}" type="text" .value=${this.form.Email.value} @input=${HandleInput(this.form.Email)}>
          <ty-error .item=${this.form.Email}></ty-error>
        </label>

        <button .disabled=${this.invalid} @click=${Submit}>SUBMIT</button>
      </form>
    `
  }
}