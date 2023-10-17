<script lang="ts">
	import { string, builder, date } from 'tyform';
	import isEmail from 'validator/es/lib/isEmail';
	import isMobilePhone from 'validator/es/lib/isMobilePhone';
	import isNumeric from 'validator/es/lib/isNumeric';
	import isDate from 'validator/es/lib/isDate';

	interface Usuario {
		Nome: string;
		Celular: string;
		Email: string;
		CPF: string;
		DataNascimento: string;
	}

	const isCPF = (v: string) => /(\d{3})(\d{3})(\d{3})(\d{2})/.test(v);
	const isAgeAllowed = (d: string, age: number) => {
		console.log(d)
		var diff_time = Math.abs(Date.now() - new Date(d).getTime());
		var years = Math.floor((diff_time / (1000 * 3600 * 24))/365.25);

		console.log(years)
		return years > age;
	}

	const tyform = builder<Usuario>({
		Nome: string()
			.value("João Miguel")
			.transform(v => v.toUpperCase())
			.required("Name is required"),
		CPF: string()
			.validate(v => isNumeric(v)).withMessage("Only numbers")
			.validate(isCPF).withMessage("CPF format is invalid"),
		DataNascimento: string()
			.validate(d => isAgeAllowed(d, 18)).withMessage('É preciso ser maior de 18 anos'),
		Celular: string()
			.value('27998765432')
			.validate(v => isMobilePhone(v, 'pt-BR')).withMessage("Phone format is invalid"),
		Email: string()
			.value('joao.miguel@hotmail.com')
			.validate(v => isEmail(v)).withMessage("Email formatg is invalid")
	});

	const form = tyform.build();

	$: invalid = Object.values(form).reduce((acc, cur) => acc || cur.invalid, false);

	function submit() {
		const values = tyform.values();
		console.log(values);
	}
</script>

<main>
	<form>
		<label>
			Nome:
			<input class:invalid={form.Nome.invalid} bind:value={form.Nome.value} type="text">
			<small>{form.Nome.error.join(',')}</small>
		</label>
		<label>
			CPF:
			<input class:invalid={form.CPF.invalid} bind:value={form.CPF.value} type="text">
			<small>{form.CPF.error.join(',')}</small>
		</label>
		<label>
			Data de nascimento:
			<input class:invalid={form.DataNascimento.invalid} bind:value={form.DataNascimento.value} type="date">
			<small>{form.DataNascimento.error.join(',')}</small>
		</label>
		<label>
			Celular:
			<input class:invalid={form.Celular.invalid} bind:value={form.Celular.value} type="text">
			<small>{form.Celular.error.join(',')}</small>
		</label>
		<label>
			Email:
			<input class:invalid={form.Email.invalid} bind:value={form.Email.value} type="text">
			<small>{form.Email.error.join(',')}</small>
		</label>

		<button on:click={submit} type="button" disabled={invalid}>Submit</button>
	</form>
</main>

<style>
	:root {
		--error-color: #ff4b4b;
	}

	main {	
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

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
	}

	input.invalid {
		border: 0.1em solid var(--error-color);
	}

	small {
		color: var(--error-color);
	}

	button {
		width: fit-content;
	}
</style>
