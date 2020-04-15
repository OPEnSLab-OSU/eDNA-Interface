

import { Fragment, h } from "preact";
import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import { Form, Formik, useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";
import Switch from "react-switch";
import * as yup from "yup";

import { BasicTextArea, FormikControlledTextField, TaskScheduleTimeFields } from "./Fields";
import Schema from "App/Schema";
import API from "App/API";
import {  } from "App/redux/actions";

import { FaRegTrashAlt } from "react-icons/fa";

function FormikListner() {
	const { values } = useFormikContext();
	try {
		console.log("OnChange: ", values);
		// console.log("Cast: ", cast);
	} catch (error) {
		// console.log("Casting error");
	}
}

function secondsToDhms(seconds) {
	seconds = Number(seconds);
	if (seconds == 0) {
		return "0 second";
	}
	
	const d = Math.floor(seconds / (3600 * 24));
	const h = Math.floor(seconds % (3600 * 24) / 3600);
	const m = Math.floor(seconds % 3600 / 60);
	const s = Math.floor(seconds % 60);
	
	const dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
	const hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
	const mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
	const sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

function calculateRuntime(values) {
	const { flushTime, sampleTime, dryTime, preserveTime } = values;
	return secondsToDhms(flushTime + sampleTime + dryTime + preserveTime);
}

function TaskConfig(props) {
	const formik = useFormikContext();

	return (
		<Form className={classNames("taskconfig", { "expanded": true })}>
			<div className="headline">
				<div className="title">
					{formik.values.name}
					<br />
					<span>{"max duration=" + calculateRuntime(formik.values)}</span>
				</div>

				<button 
					className="button save-button" 
					disabled={false} 
					type="button"
					onClick={() => {
						formik.setFieldValue("submitAction", "SAVE_AS_DRAFT");
						formik.submitForm();
					}}>Save as draft</button>

				<button className="button delete-button"
					type="button"
					onClick={() => {
						formik.setFieldValue("submitAction", "DELETE");
						formik.submitForm();
					}}>
					delete
				</button>

				<Switch
					className="react-switch"
					width={48}
					height={24}
					checked={formik.values.status}
					onColor="#00b3b3"
					onChange={() => {
						formik.setFieldValue("submitAction", "SCHEDULE");
						formik.handleSubmit();
					}}/>
			</div>
				
			<FormikControlledTextField 
				name="name" 
				title="Task Name *"
				placeholder="Untitled"
				helpertext="Name used to identify the valve group"
				type="text"/>

			<FormikControlledTextField
				name="date"
				title="Schedule Date *"
				helpertext="Specific date when to run this group (YYYY-MM-DD)"
				type="date"/>

			<FormikControlledTextField
				name="time"
				title="Schedule Time *"
				helpertext="Specific time when to run this group (HH:MM)"
				type="time"/>

			<FormikControlledTextField
				name="valves"
				title="Valves *"
				helpertext="Valves assigned to this task"
				type="text" placeholder="e.g. 1,2,3,4,5"/>

			<TaskScheduleTimeFields 
				title="Time Between"
				helpertext="Controls how long until the next sample in the group"/>
		
			<BasicTextArea 
				name="notes"
				title="Notes"
				subtitle="Additional information associated with this group up to 250 characters" 
				type="text" helpertext="Describe the task (optional)"/>
		</Form>
	);
}

export { TaskConfig };