import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { builder as tyform, string } from 'tyform'
import { Form, FormBuilder } from 'packages/form/src/types';

@Component({
  selector: 'tyform-example',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <style>

      :root {
        --error-color: rgb(255, 75, 75);
      }

      form {
        display: flex;
        flex-direction: column;

        gap: 10px;

        max-width: 500px;
        width: 500px;
      }

      form label {
        display: flex;
        flex-direction: column;
      }

      form label input {
        margin-top: 5px;
      }

      form label input.invalid {
        border: 0.1em solid var(--error-color);
      }

      form label small {
        color: var(--error-color);
      }

      form button {
        width: fit-content;
      }
    </style>

    <form>
      <label>
        Name:
        <input [class.invalid]="form.Name.invalid" name="Name" [(ngModel)]="form.Name.value" type="text"/>
        <small>{{form.Name.error.join(', ')}}</small>
      </label>
      <label>
        Phone:
        <input id="phone-input" type="text"/>
        <small>{{form.Phone.error.join(', ')}}</small>
      </label>
      <label>
        Email:
        <input [class.invalid]="form.Email.invalid" name="Email" [(ngModel)]="form.Email.value" type="text"/>
        <small>{{form.Email.error.join(', ')}}</small>
      </label>
      <button [disabled]="isFormInvalid" (click)="submit()">Submit</button>
    </form>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class TyformExampleComponent implements OnInit {
  public readonly PHONE_RGX = /(\d{2})(\d)(\d{4})(\d{4})/;
  public readonly EMAIL_RGX = /([\w_.]+)@(\w+\.\w+)/;

  private buider!: FormBuilder<Contact>;
  public form!: Form<Contact>;

  public get isFormInvalid() {
    return Object.values(this.form).reduce((acc, cur) => cur.invalid || acc, false)
  }

  ngOnInit(): void {

    this.buider = tyform<Contact>({
      Name: string()
        .required("Name is required"),
      Phone: string()
        .bind("#phone-input")
        .validate(value => this.PHONE_RGX.test(value)).withMessage('Phone format is invalid'),
      Email: string()
        .validate(value => this.EMAIL_RGX.test(value)).withMessage('Email format is invalid')
    }).init({
      Name: 'João Miguel',
      Phone: '27998765432',
      Email: 'jao.miguel@hotmail.com'
    })

    this.form = this.buider.build();
  }

  submit() {
    const values = this.buider.values();
    console.log(values)
  }
}

interface Contact {
  Name: string;
  Phone: string;
  Email: string;
}