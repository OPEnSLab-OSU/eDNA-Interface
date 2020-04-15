import { Fragment, h } from "preact";
import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import { Formik, useField, useFormik, useFormikContext } from "formik";

import { useDispatch, useSelector } from "react-redux";
import { actions, setDisplayLoadingScreen, toggleValveSelection } from "App/redux/actions";

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
	const { configName,  ...property } = props;
	const [fields, meta] = useField(configName + capitalizeFirst(property.alias ?? property.name));

	return <BasicTextField
		type={property.type}
		title={property.name} 
		helpertext={property.description} 
		error={meta.touched && meta.error}
		{...fields}
	/>;
}

function Config(props) {
	const { config, colorIndex } = props;
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
		.required(),
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
		.ensure(),
	hour: yup.number()
		.min(0),
	minute: yup.number()
		.min(0),
	second: yup.number()
		.min(0),
	notes: yup.string()
		.nullable()
});

function StateConfig(_) {
	const dispatch = useDispatch();
	const tasks = useSelector(state => state.tasks);
	const selectedTaskName = useSelector(state => state.selectedTask);
	const selectedTask = tasks[selectedTaskName];
	if (!selectedTask) {
		return null;
	}

	const handleFormSubmit = async (values, ) => {
		try {
			dispatch(setDisplayLoadingScreen(true));
			if (values.status === 0) {
	
				if (selectedTask.name !== values.name) {
					values["newName"] = values.name;
					values["name"] = selectedTask.name;
				}
	
				const schedule = new Date(`${values.date}T${values.time}:00`);
				values["schedule"] = Math.floor(schedule.getTime() / 1000);
				
				console.log(schedule, schedule.getTime());
				console.trace(values);
	
				if (schedule <= new Date()) {
					throw "Must be in the future";
				}
	
				switch (values.submitAction) {
				case "SAVE_AS_DRAFT":
					await API.store.uploadTask(values);
					break;
				case "DELETE":
					await API.store.deleteTaskWithName(values.name);
					break;
				case "SCHEDULE":
					await API.store.uploadAndScheduleTask(values);
					break;
				default:
					throw "Unexpected action";
				}
			}

			dispatch(setDisplayLoadingScreen(false));
		} catch {
			dispatch(setDisplayLoadingScreen(false));
		}
	};

	const formikConfig = {
		initialValues: Schema.Task.cast(selectedTask),
		enableReinitialize: true,
		validationSchema: TaskValidationSchema
	};

	
	const { flush, sample, dry, preserve } = StateConfigs;
	return (
		<Formik {...formikConfig} onSubmit={handleFormSubmit}>{(formik) => (
			<div className="stateconfig">
				<div className="column">
					<TaskConfig expanded={true}/>
				</div>
				<div className="column">
					<Config config={flush} colorIndex={0}/>
					<Config config={sample} colorIndex={1}/>
				</div>
				<div className="column">
					<Config config={dry} colorIndex={2}/>
					<Config config={preserve} colorIndex={3} />
				</div>
			</div>
		)}</Formik>
	);
}

export { StateConfig };