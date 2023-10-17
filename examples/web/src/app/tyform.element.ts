import { builder as tyform, string } from 'tyform';
import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './tyinput/tyinput.element';
import './tyinput/tyerror.element';

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

    ty-input {
      margin-top: 5px;
    }

    button {
      width: fit-content;
    }
  `;

  @state()
  private invalid = false;

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

    const form = builder.build();

    builder.subscribe(form => {
      this.invalid = Object.values(form).reduce((acc, cur) => acc || cur.invalid, false);
    })

    const Submit = (e: Event) => {
      e.preventDefault();
      const values = builder.values();
      console.log(values)
    }

    return html`
      <form>
        <label>
          Name:
          <ty-input .item=${form.Name}></ty-input>
          <ty-error .item=${form.Name}></ty-error>
        </label>

        <label>
          Phone:
          <ty-input .item=${form.Phone}></ty-input>
          <ty-error .item=${form.Phone}></ty-error>
        </label>

        <label>
          Email:
          <ty-input .item=${form.Email}></ty-input>
          <ty-error .item=${form.Email}></ty-error>
        </label>

        <button .disabled=${this.invalid} @click=${Submit}>SUBMIT</button>
      </form>
    `
  }
}