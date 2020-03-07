

import { Fragment, h } from "preact";
import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import { Formik, useField, useFormik, useFormikContext } from "formik";
import { BasicTextField, TextFieldComponent } from "Components/TextField";
import { useSelector } from "react-redux";


function TaskScheduleTimeFields(props) {
	const { getFieldProps } = useFormikContext();
	return (
		<TextFieldComponent className="textfield time" {...props}>{ (_) => 
			<Fragment>
				{["hour", "minute", "second"].map(t => 
					<input key={t} name={t} 
						className="input" 
						type="number" 
						placeholder={t + "s"} 
						required {...getFieldProps(t)}/>
				)}
			</Fragment>
		}</TextFieldComponent>
	);
}

function BasicTextArea(props) {
	const { getFieldProps } = useFormikContext();
	return (
		<TextFieldComponent className="textfield textarea" {...props}>{ (rest) =>
			<textarea name="notes" className={"input"} {...rest} {...getFieldProps("notes")}/>
		}</TextFieldComponent>
	);
}
export function TaskConfig(props) {
	const valves = useSelector(state => state.valves);
	const selectedValves = valves.selected.join(", ");
	const expanded = props.expanded ?? true;
	return (
		<Formik initialValues={{}}>{ (formik) => (
			<form className={classNames("taskconfig", { "expanded": expanded })}>
				<div className="headline">
					<div className="title">
						Task Settings
					</div>
				</div>
				
				<BasicTextField 
					name="name" 
					title="Task Name *"
					placeholder="Untitled"
					helpertext="Name used to identify the valve group"
					type="text" required {...formik.getFieldProps("name")}/>

				<BasicTextField
					name="scheduleDate"
					title="Schedule Date *"
					helpertext="Specific date when to run this group (YYYY-MM-DD)"
					type="date"/>

				<BasicTextField
					name="scheduleTime"
					title="Schedule Time *"
					helpertext="Specific time when to run this group (HH:MM)"
					type="time"/>

				<BasicTextField
					name="valves"
					title="Valves *"
					helpertext="Valves assigned to this task"
					type="text" placeholder="e.g. 1,2,3,4,5" value={selectedValves}/>

				<TaskScheduleTimeFields 
					title="Time Between *"
					helpertext="Controls how long until the next sample in the group"/>
		
				<BasicTextArea 
					name="notes"
					title="Notes"
					subtitle="Additional information associated with this group up to 250 characters" 
					type="text" placeholder="Describe what this group is for memo"/>
			</form>
		)}</Formik>
	);
}