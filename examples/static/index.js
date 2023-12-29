import { builder, string, boolean } from './tyform/index.js';
// import { builder, string, boolean } from 'https://www.unpkg.com/@tyform/form';

const phone_rgx = /(\d{2})(\d)(\d{4})(\d{4})/;
const email_rgx = /([\w_.]+)@(\w+\.\w+)/;

const contactForm = builder({
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
        .validate(v => email_rgx.test(v)).withMessage("Email format is invalid"),
    Notification: boolean()
        .value(true)
        .bind("#notification-check").withErrorOn("#notification-errors")
        .validate((v, target) => v && (!!target.Phone.value || !!target.Email.value), ['Phone', 'Email'])
            .withMessage("You must have an email or phone number to receive notifications")
});

window.contactForm = contactForm
