import { string, builder as tyform } from "tyform";
import { Button, Form, Input, Label, Small } from "./tyform-example.style";
import { FormItem } from "packages/form/src/types";
import { useState } from "react";

interface Contact {
  Name: string;
  Phone: string;
  Email: string;
}

function TyInput<T extends string | number | undefined | readonly string[]>( { item }: { item: FormItem<T> }) {
  return <Input
    type="text"
    defaultValue={item.value}
    onInput={e => item.value = (e.target as HTMLInputElement).value as T}
    ></Input>
}

function TyErrors<T>({ item } : { item: FormItem<T>}) {
  const [ errors, setErrors ] = useState(item.error);

  item.subscribe(item => setErrors(item.error))

  return <Small>
    {errors.join(', ')}
  </Small>
}

export function TyFormExample() {
  const phone_rgx = /(\d{2})(\d)(\d{4})(\d{4})/;
  const email_rgx = /([\w_.]+)@(\w+\.\w+)/;

  const builder = tyform<Contact>({
    Name: string()
      .required('Name is required')
      .transform(value => value.toUpperCase()),
    Phone: string()
      .validate(value => phone_rgx.test(value)).withMessage('Phone format is invalid'),
    Email: string()
      .validate(value => email_rgx.test(value)).withMessage('Email format is invalid')
  }).init({
    Name: 'João Miguel',
    Phone: '27998765432',
    Email: 'joao.miguel@hotmail.com'
  })

  const form = builder.build();

  const [invalid, setInvalid] = useState(false);

  builder.subscribe(form => {
    const result = Object.values(form).reduce((acc, cur) => cur.invalid || acc, false);
    setInvalid(result);
  });
  
  const Submit = (e: Event) => {
    e.preventDefault();
    const values = builder.values();
    console.log(values);
  }

  return (
    <Form>
      <Label>
        Name:
        <TyInput item={form.Name}></TyInput>
        <TyErrors item={form.Name}></TyErrors>
      </Label>
      <Label>
        Phone:
        <TyInput item={form.Phone}></TyInput>
        <TyErrors item={form.Phone}></TyErrors>
      </Label>
      <Label>
        Email:
        <TyInput item={form.Email}></TyInput>
        <TyErrors item={form.Email}></TyErrors>
      </Label>
      <Button disabled={invalid} onClick={ev => Submit(ev.nativeEvent)}>Submit</Button>
    </Form>
  );
}

export default TyFormExample;
