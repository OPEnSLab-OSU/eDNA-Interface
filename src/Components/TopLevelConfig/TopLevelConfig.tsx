import { h } from "preact";
import { useDispatch, useSelector } from "react-redux";
import { setDisplayLoadingScreen } from "App/redux/actions";
import { API } from "App/API";
import * as yup from "yup";
import { RootState } from "App/redux/store";
import { stateConfigData } from "./stateconfigsdata";

// const TaskValidationSchema = yup.object({
// 	name: yup.string().trim().required("Task name is required and must be unique"),
// 	status: yup.number().required().min(0).default(0),
// 	date: yup.string().ensure(),
// 	time: yup.string().ensure(),
// 	valves: yup.array(yup.number()).required().ensure(),
// 	hour: yup.number().required().min(0, "Hour must be a positive number"),
// 	minute: yup.number().min(0, "Minute must be a positive number"),
// 	second: yup.number().min(0, "Second must be a positive number"),
// 	notes: yup.string().nullable(),
// });

export function TopLevelConfig() {
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
				throw new Error(`Unexpected action: ${values.submitAction}`);
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
				throw new Error(`Unexpected action: ${values.submitAction}`);
		}
	};

	if (!selectedTask) {
		return null;
	}

	return (
		<div className="stateconfig">
			<div className="column">{/* <TaskConfig expanded /> */}</div>
			{/* <div className="column">
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
			</div> */}
		</div>
	);
}
