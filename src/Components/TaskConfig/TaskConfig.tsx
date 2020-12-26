import cn from "classnames";
import { h } from "preact";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Switch from "react-switch";

import { API } from "App/API";
import { setDisplayLoadingScreen } from "App/redux/actions";
import { Task, verifyTaskFromAPI } from "App/redux/models";
import { selectedTaskSelector } from "App/redux/selectors";

import { BasicTextField } from "Components/TextField";

import { secondToTimeComponents, sum, toDateString, toTimeString, zip } from "Util";

import {
	FormControlledNotes,
	FormControlledTimeFields,
	FormControlledValveFields,
} from "./Fields";

export interface FormValues extends Task {
	date: string;
	time: string;
	hour: number;
	minute: number;
	second: number;
	id: number;
}

//
// ────────────────────────────────────────────────────── I ──────────
//   :::::: H E L P E R S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────
//

const secondsToTimeString = (seconds: number): string => {
	if (seconds === 0) {
		return "0 second";
	}

	const { day, hour, minute, second } = secondToTimeComponents(seconds);
	const values = [day, hour, minute, second];
	const tokens = ["day", "hour", "minute", "second"];
	return zip(values, tokens)
		.filter((e) => e[0] > 0)
		.map((e) => (e[0] == 0 ? e.join(" ") : `${e.join(" ")}s`))
		.join();
};

const DisplayRuntime = () => {
	const { watch } = useFormContext();
	const fields = watch(["flushTime", "sampleTime", "dryTime", "preserveTime"]);
	const total = sum(Object.values(fields).map((e) => parseInt(e, 10)));
	return (
		<span>{`max operating duration per valve=${secondsToTimeString(total)}`}</span>
	);
};

//
// ──────────────────────────────────────────────────────────── II ──────────
//   :::::: T A S K C O N F I G : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────
//

export const mergeWithFormValues = (base: Task, values: any) => {
	const taskForMerge: Task = { ...base };
	taskForMerge.name = values.name;
	taskForMerge.notes = values.notes;

	const { date, time } = values;
	const schedule = new Date(`${date}T${time}:00`);
	taskForMerge.schedule = Math.floor(schedule.getTime() / 1000);

	const { hour, minute, second } = values;
	taskForMerge.timeBetween = sum([
		parseInt(hour, 10) * 60 * 24,
		parseInt(minute, 10) * 60,
		parseInt(second, 10),
	]);

	[
		"flushTime",
		"flushVolume",
		"sampleTime",
		"samplePressure",
		"sampleVolume",
		"dryTime",
		"preserveTime",
	].forEach((f) => {
		(taskForMerge as any)[f] = parseInt(values[f], 10);
	});

	return taskForMerge;
};

export const defaultValuesFromTask = (task: Task) => ({
	...task,
	...secondToTimeComponents(task.timeBetween),
	date: toDateString(task.schedule),
	time: toTimeString(task.schedule),
});

export function TaskConfig() {
	const { register, getValues, watch, handleSubmit, reset } = useFormContext();
	const dispatch = useDispatch();
	const selectedTask = useSelector(selectedTaskSelector);
	const isTaskActive = selectedTask?.status == 1;

	if (!selectedTask) {
		return null;
	}

	const onSave = async () => {
		dispatch(setDisplayLoadingScreen(true));
		const taskForSubmission = mergeWithFormValues(selectedTask, getValues());
		const verified = await verifyTaskFromAPI(taskForSubmission);
		await API.store.uploadTask(verified);
		dispatch(setDisplayLoadingScreen(false));
		reset(defaultValuesFromTask(verified));
	};

	const onDelete = async () => {
		if (selectedTask.status == 1) {
			alert("Not supposed to happen. Please stop looking around!");
			return;
		}

		const response = await API.store.deleteTask(selectedTask.id);
		if (response.success) {
			console.log(response.success);
		}
	};

	const onSchedule = async () => {
		const [response] = await API.store.scheduleTask(selectedTask.id);
		console.log(response.success);
	};

	const onUnschedule = async () => {
		const [response] = await API.store.unscheduleTask(selectedTask.id);
		console.log(response.success);
	};

	const onChecked = async (checked: boolean) => {
		checked ? handleSubmit(onSchedule)() : handleSubmit(onUnschedule)();
	};

	return (
		<div className={cn("taskconfig", { expanded: true })}>
			<div className="headline">
				<div className="title">
					{watch("name")}
					<br />
					<DisplayRuntime />
				</div>

				<button
					className="button save-button"
					disabled={isTaskActive}
					type="button"
					onClick={onSave}>
					save
				</button>

				<button
					className="button delete-button"
					type="button"
					disabled={isTaskActive}
					onClick={onDelete}>
					delete
				</button>

				<Switch
					className="react-switch"
					width={48}
					height={24}
					checked={isTaskActive}
					onColor="#00b3b3"
					onChange={onChecked}
				/>
			</div>

			<BasicTextField
				name="name"
				register={register}
				title="Task Name *"
				helpertext="Name of the task"
				disabled={isTaskActive}
			/>

			<BasicTextField
				name="date"
				type="date"
				register={register}
				title="Schedule Date *"
				helpertext="Specific date when to run this group (YYYY-MM-DD)"
				disabled={isTaskActive}
			/>

			<BasicTextField
				name="time"
				type="time"
				register={register}
				title="Schedule Time *"
				helpertext="Specific time when to run this group (HH:MM)"
				disabled={isTaskActive}
				onChange={(e) => {
					console.log(e.currentTarget.value);
				}}
			/>

			<FormControlledValveFields valves={selectedTask?.valves ?? []} />
			<FormControlledTimeFields disabled={isTaskActive} />
			<FormControlledNotes disabled={isTaskActive} />
		</div>
	);
}
