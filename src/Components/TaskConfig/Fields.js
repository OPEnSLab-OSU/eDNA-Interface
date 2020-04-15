import { Fragment, h } from "preact";
import { ErrorMessage, useField, useFormikContext } from "formik";
import { BasicTextField, TextFieldComponent } from "Components/TextField/";



function TaskScheduleTimeFields(props) {
	const { getFieldProps } = useFormikContext();
	return (
		<TextFieldComponent className="textfield time" {...props}>{(_) => 
			<>{["hour", "minute", "second"].map(t => 
				<input key={t} name={t} 
					className="input" 
					type="number" 
					placeholder={t + "s"} 
					required {...getFieldProps(t)}/>
			)}</>
		}</TextFieldComponent>
	);
}

function BasicTextArea(props) {
	const { getFieldProps } = useFormikContext();
	return (
		<TextFieldComponent className="textfield textarea" {...props}>{(rest) =>
			<textarea name="notes" className={"input"} {...rest} {...getFieldProps("notes")}/>
		}</TextFieldComponent>
	);
}

function FormikControlledTextField(props) {
	const [fields, meta, helpers] = useField(props);
	return (
		<BasicTextField {...fields} {...props} error={meta.touched && meta.error}/>
	);
}

export { TaskScheduleTimeFields, BasicTextArea, FormikControlledTextField };