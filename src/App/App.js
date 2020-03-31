import { h } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { useDispatch, useSelector, useStore } from "react-redux";
import { apiConnect, apiSuccess, apiTimeout, selectTask, updateStatus, updateTask, updateTaskList } from "./redux/actions";

import { Dropbar, StateConfig, StateTimeline, Status, TaskConfig, TaskListing, ValveOverview } from "Components";
import { base } from "./Static.js";

import API from "./API"; 

function useStatusUpdating() {
	const store = useStore();
	const dispatch = useDispatch();
	const [statusUpdating, setStatusUpdating] = useState(false);

	// Status update effect 
	useEffect(() => {
		if (!statusUpdating) {
			return;
		}
			
		const timeout = 1000;
		const statusUpdate = async (timerId = null) => {
			try {
				const payload = await API.get("api/status").withTimeout(timeout).send();
				dispatch(updateStatus(payload));
				dispatch(apiSuccess());
			} catch (error) {
				dispatch(apiTimeout());
				if (store.getState().connection.statusText === "offline") {
					clearInterval(timerId);
					setStatusUpdating(false);
				} 
			} 
		};

		dispatch(apiConnect());
		statusUpdate();

		const timer = setInterval(() => statusUpdate(timer), timeout);
		return () => clearInterval(timer);
	}, [statusUpdating]);

	return [statusUpdating, setStatusUpdating];
}

export function App() {
	const dispatch = useDispatch();
	const panels = useSelector(state => state.panels);
	const connection = useSelector(state => state.connection);
	const [_, setStatusUpdating] = useStatusUpdating();

	// Get taskrefs
	useEffect(() => {
		(async function startup() {
			const taskrefs = await API.get("api/taskrefs").send();
			dispatch(updateTaskList(taskrefs));

			const task = await API.post("api/task/get").body(JSON.stringify({ name: "Task 1" })).send();
			dispatch(updateTask(task.name, task));
			dispatch(selectTask(task.name));
		})();
	}, []);

	return (
		<div className="app">
			{panels.status && 
				<Status connection={connection} setStatusUpdating={setStatusUpdating}/>
			}

			<main className={classNames("main", { "showTask": panels.task })}>
				<Dropbar />
				<StateTimeline />
				<ValveOverview />
				<StateConfig />
			</main>

			{panels.task &&
				<div className="task-panel">
					<TaskListing />
					<TaskConfig expanded={panels.task}/>
				</div>
			}
		</div>
	);
}