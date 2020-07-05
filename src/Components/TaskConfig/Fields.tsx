import { Fragment, FunctionalComponent, h } from "preact";
import { ErrorMessage, useForm, useFormContext } from "react-hook-form";

import { BasicTextField, TextFieldComponent } from "Components/TextField";

export const FormControlledTimeFields: FunctionalComponent<{ disabled: boolean }> = ({
	disabled,
}) => {
	const { register, errors } = useFormContext();
	const fields = ["hour", "minute", "second"];

	return (
		<TextFieldComponent
			className="textfield time"
			title="Time Between"
			helpertext="Controls how long until the next sample in the group">
			{() => (
				<Fragment>
					{fields.map((name) => (
						<input
							key={name}
							name={name}
							ref={register({
								required: `${name} is required`,
								min: { value: 0, message: `${name} Must be >= 0` },
							})}
							className="input"
							type="number"
							placeholder={`${name[0]}`}
							disabled={disabled ?? false}
						/>
					))}
					{fields.map((name) => (
						<ErrorMessage
							className="error"
							errors={errors}
							name={name}
							as="p"
						/>
					))}
				</Fragment>
			)}
		</TextFieldComponent>
	);
};

export const FormControlledValveFields: FunctionalComponent<{ valves: any[] }> = (
	props
) => {
	const valves =
		props.valves.length == 0 ? ["No valve have been assigned"] : props.valves;

	return (
		<TextFieldComponent
			className="textfield valves"
			title="Valves *"
			helpertext="Valves assigned to this task">
			{() => (
				<div className="valve-badge-container">
					{valves.map((v: any) => (
						<span key={v} className="valve-badge">
							{v}
						</span>
					))}
				</div>
			)}
		</TextFieldComponent>
	);
};

export const FormControlledNotes: React.FC<any> = ({ disabled }) => {
	const { register } = useFormContext();

	return (
		<TextFieldComponent
			className="textfield textarea"
			title="Notes"
			helpertext="Describe the task (optional)">
			{() => (
				<textarea
					className="input"
					name="notes"
					ref={register}
					disabled={disabled}
					placeholder="Additional information associated with this group up to 250 characters"
				/>
			)}
		</TextFieldComponent>
	);
};
