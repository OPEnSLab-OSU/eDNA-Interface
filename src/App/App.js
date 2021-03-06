import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useDispatch, useSelector, useStore } from "react-redux";
import { apiConnect } from "./redux/actions";

import { Dropbar, StateTimeline, Status, TaskListing, TopLevelConfig, ValveOverview } from "Components";

import API from "./API"; 
import { LoadingScreen } from "Components";

// ────────────────────────────────────────────────────────────────────────────────
// Get status update from the server every second. Stop the update if receive three
// consecutive failed attempts.
// ────────────────────────────────────────────────────────────────────────────────
function useStatusUpdating() {
	const store = useStore();
	const dispatch = useDispatch();
	const [statusUpdating, setStatusUpdating] = useState(false);

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
	const dispatch = useDispatch();
	const panels = useSelector(state => state.panels);
	const connection = useSelector(state => state.connection);
	const loadingScreen = useSelector(state => state.loadingScreen);
	const [_, setStatusUpdating] = useStatusUpdating();

	// Get list of tasks from the server
	useEffect(() => {
		(async function startup() {
			await API.store.getTaskList();
			// await API.store.getTaskWithName("Task 1");
			// dispatch(selectTask("Task 1"));
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
				<TopLevelConfig />
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