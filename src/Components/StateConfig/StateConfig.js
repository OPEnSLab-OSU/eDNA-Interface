import { h } from "preact";
import { Formik, useField } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { clearValveSelection, setDisplayLoadingScreen, updateTask } from "App/redux/actions";

import { BasicTextField, TaskConfig } from "Components";
import API from "App/API";
import Schema from "App/Schema";
import * as yup from "yup";

const StateConfigs = {
	flush: {
		name: "flush",
		properties: [{ 
			"name": "duration",
			"alias": "time",
			"type": "number",
			"description": "Controls how long before transitioning to the sample state" 
		}, {
			"name": "volume",
			"description": "Controls how much water will be used to flush the system" 
		}] 
	},
	sample: {
		name: "sample",
		properties: [{ 
			"name": "duration",
			"alias": "time",
			"type": "number",
			"description": "Controls how long before transitioning to the dry state" 
		}, {
			"name": "volume",
			"type": "number",
			"description": "Controls how much water will be sampled" 
		}, {
			"name": "pressure",
			"type": "number",
			"description": "Controls when to automatically stop when the pressure exeeds the given limit" 
		}] 
	},
	dry: {
		name: "dry",
		properties: [{ 
			"name": "duration",
			"alias": "time",
			"type": "number",
			"description": "Controls how long before transitioning to the preserve state" 
		}] 
	},

	preserve: {
		name: "preserve",
		properties: [{ 
			"name": "duration",
			"alias": "time",
			"type": "number",
			"description": "Controls how long before transitioning to the stop state" 
		}] 
	},
};

function capitalizeFirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function FormikConfigField(props) {
	const { configName, disabled,  ...property } = props;
	const [fields, meta] = useField(configName + capitalizeFirst(property.alias ?? property.name));

	return <BasicTextField
		type={property.type}
		title={property.name} 
		helpertext={property.description} 
		error={meta.touched && meta.error}
		disabled={disabled}
		{...fields}
	/>;
}

function Config(props) {
	const { config, colorIndex, disabled } = props;

	return (
		<div className="config">
			<h2 className={classNames("headline", "background-accent-" + (colorIndex + 1))}>
				{config.name}
				<i className={classNames("square", "background-accent-" + (colorIndex + 1))}></i>
			</h2>
			<div className="content">
				{config.properties.map((property, i) => (
					<FormikConfigField key={i}
						configName={config.name}
						disabled={disabled}
						{...property}
					/>
				))}
			</div>
		</div>
	);
}

const TaskValidationSchema = yup.object({
	name: yup.string()
		.trim()
		.required("Task name is required and must be unique"),
	// status represents the operational status of the task
	status: yup.number()
		.required()
		.min(0)
		.default(0),
	date: yup.string()
		.ensure(),
	time: yup.string()
		.ensure(),
	valves: yup.array(yup.number())
		.required()
		.ensure(),
	hour: yup.number()
		.required()
		.min(0, "Hour must be a positive number"),
	minute: yup.number()
		.min(0, "Minute must be a positive number"),
	second: yup.number()
		.min(0, "Second must be a positive number"),
	notes: yup.string()
		.nullable()
});

function StateConfig(_) {
	const dispatch = useDispatch();

	const tasks = useSelector(state => state.tasks);
	const taskname = useSelector(state => state.selectedTask);
	const task = tasks[taskname];
	if (!task) {
		return null;
	}

	const submit = async (values) => {
		switch (values.submitAction) {
		case "SAVE":
			await API.store.uploadTask(values);
			break;
		case "DELETE":
			await API.store.deleteTaskWithName(values.name);
			break;
		case "SCHEDULE": {
			const response = await API.store.scheduleTask(values.name);
			if (response.success) {
				dispatch(updateTask(response.payload));
			}
		}
			break;
		default:
			console.trace("Unexpected action: ", values.submitAction);
		}
	};

	const unschedule = async (values) => {
		switch (values.submitAction) {
		case "UNSCHEDULE":{
			const response = await API.store.unscheduleTask(values.name);
			if (response.success) {
				dispatch(updateTask(response.payload));
			}
		}
			break;
		default:
			console.trace("Unexpected action: ", values.submitAction);
		}
	};

	const handleFormSubmit = async (values, helpers) => {
		try {
			dispatch(setDisplayLoadingScreen(true));
			if (values.status === 1) {
				unschedule(values);
			} else {

				// Detect name change. This is important since name is used to identification
				if (task.name !== values.name) {
					values["newName"] = values.name;
					values["name"] = task.name;
				}

				// Change schedule back from milli to second
				const schedule = new Date(`${values.date}T${values.time}:00`);
				values["schedule"] = Math.floor(schedule.getTime() / 1000);
				
				// Time validation
				if (schedule <= new Date()) {
					console.log("Must be in the future");
				}

				submit(values);
			}

			dispatch(clearValveSelection());
			dispatch(setDisplayLoadingScreen(false));
		} catch {
			dispatch(setDisplayLoadingScreen(false));
		}
	};

	const formikConfig = {
		initialValues: Schema.Task.cast(task),
		validationSchema: TaskValidationSchema,
		enableReinitialize: true,
	};

	const { flush, sample, dry, preserve } = StateConfigs;
	return (
		<Formik {...formikConfig} onSubmit={handleFormSubmit}>{(_) => (
			<div className="stateconfig">
				<div className="column">
					<TaskConfig expanded={true}/>
				</div>
				<div className="column">
					<Config config={flush} colorIndex={0} disabled={task.status == 1}/>
					<Config config={sample} colorIndex={1} disabled={task.status == 1}/>
				</div>
				<div className="column">
					<Config config={dry} colorIndex={2} disabled={task.status == 1}/>
					<Config config={preserve} colorIndex={3} disabled={task.status == 1}/>
				</div>
			</div>
		)}</Formik>
	);
}

export { StateConfig };