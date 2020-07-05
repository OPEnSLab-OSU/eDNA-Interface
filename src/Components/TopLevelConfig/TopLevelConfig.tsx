import { h } from "preact";
import { useEffect } from "preact/hooks";
import { FormContext, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import { API } from "App/API";
import { setDisplayLoadingScreen } from "App/redux/actions";
import { Task } from "App/redux/models";
import { selectedTaskSelector } from "App/redux/selectors";

import { StateConfig } from "Components/StateConfig";
import { FormValues, TaskConfig } from "Components/TaskConfig";

import { secondToTimeComponents, toDateString, toTimeString } from "Util";

import { stateConfigData } from "./stateconfigsdata";

export function TopLevelConfig() {
	const selectedTask = useSelector(selectedTaskSelector)!;

	const defaultValuesFromTask = (task: Task) => ({
		...task,
		...secondToTimeComponents(task.timeBetween),
		date: toDateString(task.schedule),
		time: toTimeString(task.schedule),
	});

	const hookForm = useForm<FormValues>({
		defaultValues: defaultValuesFromTask(selectedTask),
	});

	useEffect(() => {
		console.log("Valve Toggled: ", selectedTask.valves);
		hookForm.reset(defaultValuesFromTask(selectedTask));
	}, [selectedTask]);

	const handleSubmit = async () => {
		console.log("Submit");
		console.log(hookForm.getValues());
	};

	return (
		<div className="stateconfig">
			<FormContext {...hookForm}>
				<form onSubmit={handleSubmit}>
					<div className="column">
						<TaskConfig expanded />
					</div>
				</form>
			</FormContext>
			<div className="column">
				<StateConfig
					config={stateConfigData.flush}
					register={hookForm.register}
					colorIndex={0}
					disabled={selectedTask.status === 1}
				/>
				<StateConfig
					config={stateConfigData.sample}
					register={hookForm.register}
					colorIndex={1}
					disabled={selectedTask.status === 1}
				/>
			</div>
			<div className="column">
				<StateConfig
					config={stateConfigData.dry}
					register={hookForm.register}
					colorIndex={2}
					disabled={selectedTask.status === 1}
				/>
				<StateConfig
					config={stateConfigData.preserve}
					register={hookForm.register}
					colorIndex={3}
					disabled={selectedTask.status === 1}
				/>
			</div>
		</div>
	);
}
