import { h } from "preact";

import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { useDispatch, useSelector, useStore } from "react-redux";
import { apiConnect, selectTask, setDisplayLoadingScreen, updateTask, updateTaskList } from "./redux/actions";

import { Dropbar, StateConfig, StateTimeline, Status, TaskConfig, TaskListing, ValveOverview } from "Components";

import API from "./API"; 
import { LoadingScreen } from "Components";

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
				await API.store.getStatus(timeout);
			} catch (error) {
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
	const panels = useSelector(state => state.panels);
	const connection = useSelector(state => state.connection);
	const loadingScreen = useSelector(state => state.displayLoadingScreen);
	const [_, setStatusUpdating] = useStatusUpdating();

	// console.log("Loading screen: ", loadingScreen.show);

	// Get taskrefs
	useEffect(() => {
		(async function startup() {
			await API.store.getTaskList();
			await API.store.getTaskWithName("Task 1");
			dispatch(selectTask("Task 1"));
		})();
	}, []);

	return (
		<div className="app">
			<Status />
			<main className="main">
				<Dropbar />
				<StateTimeline />
			</main>

			{panels.task &&
				<div className="task-panel">
					<TaskListing />
				</div>
			}

			<LoadingScreen hide={loadingScreen.hide} />
		</div>
	);
}