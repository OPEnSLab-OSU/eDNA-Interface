import { h } from "preact";
import { useField, useFormikContext } from "formik";
import { BasicTextField, TextFieldComponent } from "Components/TextField/";


function TaskScheduleTimeFields(props) {
	const { getFieldProps, getFieldMeta } = useFormikContext();
	const fields = ["hour", "minute", "second"];
	// const mapsFieldsToProps = fields.map(getFieldProps);
	const mapsFieldsToMetas = fields.map(getFieldMeta);
	const errors = mapsFieldsToMetas.filter(m => m.error).map(m => m.error);

	return (
		<TextFieldComponent className="textfield time" {...props} errors={errors}>{(_) => 
			<>{["hour", "minute", "second"].map(t => 
				<input key={t} name={t} 
					className="input" 
					type="number" 
					placeholder={t + "s"} 
					required {...getFieldProps(t)}
					disabled={props.disabled ?? false}/>
			)}</>
		}</TextFieldComponent>
	);
}

function TaskValveFields(props) {
	const { values } = useFormikContext();
	const  __valves = values.valves;
	const valves = __valves.length == 0 ? ["No Valve has been assigned"] : __valves;
	
	return (
		<TextFieldComponent className="textfield valves" {...props}>{(_) => 
			<div className="valve-badge-container">{valves.map(v => 
				<span key={v} className="valve-badge">
					{v}
				</span>)}
			</div>}
		</TextFieldComponent>
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

export {
	TaskScheduleTimeFields,
	TaskValveFields,
	BasicTextArea,
	FormikControlledTextField 
};