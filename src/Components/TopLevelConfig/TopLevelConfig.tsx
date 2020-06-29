import { h } from "preact";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { StateConfig, TaskConfig } from "Components";
import { setDisplayLoadingScreen } from "App/redux/actions";
import API from "App/API";
import * as yup from "yup";
import { RootState } from "App/redux/store";

const StateConfigs = {
	flush: {
		name: "flush",
		properties: [
			{
				name: "duration",
				alias: "time",
				type: "number",
				description:
					"Controls how long before transitioning to the sample state",
			},
			{
				name: "volume",
				description:
					"Controls how much water will be used to flush the system",
			},
		],
	},
	sample: {
		name: "sample",
		properties: [
			{
				name: "duration",
				alias: "time",
				type: "number",
				description:
					"Controls how long before transitioning to the dry state",
			},
			{
				name: "volume",
				type: "number",
				description: "Controls how much water will be sampled",
			},
			{
				name: "pressure",
				type: "number",
				description:
					"Controls when to automatically stop when the pressure exeeds the given limit",
			},
		],
	},
	dry: {
		name: "dry",
		properties: [
			{
				name: "duration",
				alias: "time",
				type: "number",
				description:
					"Controls how long before transitioning to the preserve state",
			},
		],
	},
	preserve: {
		name: "preserve",
		properties: [
			{
				name: "duration",
				alias: "time",
				type: "number",
				description:
					"Controls how long before transitioning to the stop state",
			},
		],
	},
};

const TaskValidationSchema = yup.object({
	name: yup.string().trim().required("Task name is required and must be unique"),
	status: yup.number().required().min(0).default(0),
	date: yup.string().ensure(),
	time: yup.string().ensure(),
	valves: yup.array(yup.number()).required().ensure(),
	hour: yup.number().required().min(0, "Hour must be a positive number"),
	minute: yup.number().min(0, "Minute must be a positive number"),
	second: yup.number().min(0, "Second must be a positive number"),
	notes: yup.string().nullable(),
});

function TopLevelConfig() {
	const dispatch = useDispatch();
	const tasks = useSelector((state: RootState) => state.tasks);
	const selectedTaskId = useSelector((state: RootState) => state.selectedTask);
	const selectedTask = tasks[selectedTaskId];

	// Submit handler
	const submit = async (values: any) => {
		switch (values.submitAction) {
			case "SAVE": {
				await API.store.uploadTask(values);
				break;
			}
			case "DELETE": {
				await API.store.deleteTask(values.id);
				break;
			}
			case "SCHEDULE": {
				const response = await API.store.scheduleTask(values.id);
				if (response.success) {
					// Notify user heres
				}
				break;
			}
			default:
				throw `Unexpected action: ${values.submitAction}`;
		}
	};

	//
	const unschedule = async (values: any) => {
		switch (values.submitAction) {
			case "UNSCHEDULE": {
				const response = await API.store.unscheduleTask(values.name);
				if (response.success) {
					// Notify user here
				}
				break;
			}
			default:
				throw `Unexpected action: ${values.submitAction}`;
		}
	};

	if (!selectedTask) {
		return null;
	}

	return (
		<Formik
			initialValues={{ ...selectedTask, time: 0, date: 0 }}
			enableReinitialize={true}
			onSubmit={async values => {
				try {
					dispatch(setDisplayLoadingScreen(true));
					if (values.status === 1) {
						unschedule(values);
					} else {
						// Time validation
						if (values.schedule <= Date.now() / 1000) {
							throw "Must be in the future";
						}
						// Change schedule back from milli to second
						const schedule = new Date(
							`${values.date}T${values.time}:00`
						);
						values["schedule"] = Math.floor(schedule.getTime() / 1000);
						submit(values);
					}

					dispatch(setDisplayLoadingScreen(false));
				} catch (error) {
					console.log(error);
					dispatch(setDisplayLoadingScreen(false));
				}
			}}>
			{_ => (
				<div className="stateconfig">
					<div className="column">
						<TaskConfig expanded={true} />
					</div>
					<div className="column">
						<StateConfig
							config={StateConfigs.flush}
							colorIndex={0}
							disabled={selectedTask.status === 1}
						/>
						<StateConfig
							config={StateConfigs.sample}
							colorIndex={1}
							disabled={selectedTask.status === 1}
						/>
					</div>
					<div className="column">
						<StateConfig
							config={StateConfigs.dry}
							colorIndex={2}
							disabled={selectedTask.status === 1}
						/>
						<StateConfig
							config={StateConfigs.preserve}
							colorIndex={3}
							disabled={selectedTask.status === 1}
						/>
					</div>
				</div>
			)}
		</Formik>
	);
}

export { TopLevelConfig };
