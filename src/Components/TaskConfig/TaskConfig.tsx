import { h } from "preact";
import { useDispatch } from "react-redux";
import { Form, useFormikContext } from "formik";

import Switch from "react-switch";

import { FaRegTrashAlt } from "react-icons/fa";
import { zip } from "Util";

import {
	BasicTextArea,
	FormikControlledTextField,
	TaskScheduleTimeFields,
	TaskValveFields,
} from "./Fields";

//
// ────────────────────────────────────────────────────── I ──────────
//   :::::: H E L P E R S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────
//

function secondsToTimeString(seconds) {
	seconds = Number(seconds);
	if (seconds == 0) {
		return "0 second";
	}

	const d = Math.floor(seconds / (3600 * 24));
	const h = Math.floor((seconds % (3600 * 24)) / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor(seconds % 60);

	const values = [d, h, m, s];
	const tokens = ["day", "hour", "minute", "second"];

	return zip(values, tokens)
		.filter(e => e[0] > 0)
		.forEach(e => (e[0] > 1 ? e.join(" ") : e.join(" ") + "s"))
		.join();
}

function displayRuntime(values) {
	const { flushTime, sampleTime, dryTime, preserveTime } = values;
	return secondsToTimeString(flushTime + sampleTime + dryTime + preserveTime);
}

//
// ──────────────────────────────────────────────────────────── II ──────────
//   :::::: T A S K C O N F I G : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────
//

function TaskConfig(props) {
	const formik = useFormikContext();
	const isTaskActive = formik.values.status === 1;

	return (
		<Form className={classNames("taskconfig", { expanded: true })}>
			<div className="headline">
				<div className="title">
					{formik.values.name}
					<br />
					<span>{`max operating duration per valve=${displayRuntime(
						formik.values
					)}`}</span>
				</div>

				<button
					className="button save-button"
					disabled={isTaskActive}
					type="button"
					onClick={() => {
						formik.setFieldValue("submitAction", "SAVE");
						formik.submitForm();
					}}>
					save
				</button>

				<button
					className="button delete-button"
					type="button"
					disabled={isTaskActive}
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
					checked={formik.values.status === 1}
					onColor="#00b3b3"
					onChange={checked => {
						formik.setFieldValue(
							"submitAction",
							checked ? "SCHEDULE" : "UNSCHEDULE"
						);
						formik.submitForm();
					}}
				/>
			</div>

			<FormikControlledTextField
				name="name"
				title="Task Name *"
				placeholder="Untitled"
				helpertext="Name used to identify the valve group"
				type="text"
				disabled={isTaskActive}
			/>

			<FormikControlledTextField
				name="date"
				title="Schedule Date *"
				helpertext="Specific date when to run this group (YYYY-MM-DD)"
				type="date"
				disabled={isTaskActive}
			/>

			<FormikControlledTextField
				name="time"
				title="Schedule Time *"
				helpertext="Specific time when to run this group (HH:MM)"
				type="time"
				onChange={e => {
					props.handleChange(e);
				}}
				required
				disabled={isTaskActive}
			/>

			<TaskValveFields
				name="valves"
				title="Valves *"
				helpertext="Valves assigned to this task"
				type="text"
				placeholder="e.g. 1,2,3,4,5"
				disabled={isTaskActive}
			/>

			<TaskScheduleTimeFields
				title="Time Between"
				helpertext="Controls how long until the next sample in the group"
				disabled={isTaskActive}
			/>

			<BasicTextArea
				name="notes"
				title="Notes"
				subtitle="Additional information associated with this group up to 250 characters"
				type="text"
				helpertext="Describe the task (optional)"
				disabled={isTaskActive}
			/>
		</Form>
	);
}

export { TaskConfig };
