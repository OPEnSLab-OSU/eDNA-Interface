import { Fragment, h } from "preact";
import { BasicTextField, TextFieldComponent } from "Components/TextField";
import { useFormContext } from "react-hook-form";
import * as React from "react";

export const FormControlledTimeFields: React.FC<{ disabled: boolean }> = props => {
	const { register, errors } = useFormContext();
	const fields = ["hour", "minute", "second"];

	return (
		<TextFieldComponent className="textfield time">
			{() => (
				<Fragment>
					{fields.map(name => (
						<input
							key={name}
							name={name}
							ref={register({ required: true })}
							className="input"
							type="number"
							placeholder={name + "s"}
							disabled={props.disabled ?? false}
						/>
					))}
				</Fragment>
			)}
		</TextFieldComponent>
	);
};

interface TaskValveFieldsProps {
	valves?: string[];
}

export const FormControlledValveFields: React.FC<TaskValveFieldsProps> = props => {
	const valves = props.valves ?? ["No Valve has been assigned"];
	return (
		<TextFieldComponent
			className="textfield valves"
			title="Valves *"
			helpertext="Valves assigned to this task">
			{() => (
				<div className="valve-badge-container">
					{valves.map(v => (
						<span key={v} className="valve-badge">
							{v}
						</span>
					))}
				</div>
			)}
		</TextFieldComponent>
	);
};

export const FormControlledNotes: React.FC<any> = props => {
	const { register } = useFormContext();

	return (
		<TextFieldComponent className="textfield textarea" {...props}>
			{() => <textarea className={"input"} name="notes" ref={register} />}
		</TextFieldComponent>
	);
};

export const FormControlledTextField: React.FC<{
	name: string;
	title: string;
	helpertext?: string;
	onChange?: React.FormEventHandler<HTMLInputElement>;
}> = props => {
	const { register, errors } = useFormContext();
	return <BasicTextField ref={register} errors={errors[props.name]} {...props} />;
};
