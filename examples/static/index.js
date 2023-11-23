import { builder, string } from './tyform/index.js';

const phone_rgx = /(\d{2})(\d)(\d{4})(\d{4})/;
const email_rgx = /([\w_.]+)@(\w+\.\w+)/;

const tyform = builder({
    Name: string()
        .value('João Miguel')
        .bind("#name-input").withErrorOn("#name-errors")
        .required("Name is required"),
    Phone: string()
        .value('27998765432')
        .bind("#phone-input").withErrorOn("#phone-errors")
        .validate(v => phone_rgx.test(v)).withMessage("Phone format is invalid"),
    Email: string()
        .value('joao.miguel@hotmail.com')
        .bind("#email-input").withErrorOn("#email-errors")
        .validate(v => email_rgx.test(v)).withMessage("Email format is invalid")
});

const submitButton = document.querySelector('button');

tyform.subscribe(form => {
    const invalid = Object.values(form).reduce((acc, cur) => acc || cur.invalid, false);
    submitButton.disabled = invalid;
})

submitButton.addEventListener('click', () => {
    const values = tyform.values();
    console.log(values);
})

