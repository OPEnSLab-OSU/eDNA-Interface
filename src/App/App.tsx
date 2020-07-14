import classNames from "classnames";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import ReactNotification, { store } from "react-notifications-component";
import { useDispatch, useSelector, useStore } from "react-redux";

import { Dropbar } from "Components/Dropbar";
import { LoadingScreen } from "Components/LoadingScreen";
import { StateTimeline } from "Components/StateTimeline";
import { Status } from "Components/StatusPanel";
import { TaskListing } from "Components/TaskListing";
import { TopLevelConfig } from "Components/TopLevelConfig";
import { ValveOverview } from "Components/ValveOverview";

import { API } from "./API";
import { apiConnect, insertTask, selectTask } from "./redux/actions";
import { verifyTaskFromAPI } from "./redux/models";
import { selectedTaskSelector } from "./redux/selectors";
import { RootState } from "./redux/store";

// ────────────────────────────────────────────────────────────────────────────────
// Get status update from the server every second. Stop the update if receive three
// consecutive failed attempts.
// ────────────────────────────────────────────────────────────────────────────────
function useStatusUpdating() {
	const reduxStore = useStore();
	const dispatch = useDispatch();
	const [statusUpdating, setStatusUpdating] = useState(false);

	useEffect(() => {
		if (!statusUpdating) {
			return;
		}

		let timerId: number | null = null;
		const timeout = 1000;
		const statusUpdate = async () => {
			try {
				await API.store.getStatus(timeout);
			} catch (error) {
				if (reduxStore.getState().connection.statusText === "offline") {
					timerId && clearInterval(timerId);
					setStatusUpdating(false);
				}
			}
		};

		dispatch(apiConnect());
		statusUpdate();

		timerId = window.setInterval(statusUpdate, timeout);
		return () => timerId && clearInterval(timerId);
	}, [statusUpdating]);

	return [statusUpdating, setStatusUpdating] as const;
}

export function App() {
	const [, setStatusUpdating] = useStatusUpdating();
	const panels = useSelector((state: RootState) => state.panels);
	const connection = useSelector((state: RootState) => state.connection);
	const loadingScreen = useSelector((state: RootState) => state.loadingScreen);
	const selectedTask = useSelector(selectedTaskSelector);
	const dispatch = useDispatch();

	// Get list of tasks from the server
	useEffect(() => {
		(async () => {
			await API.store.getTaskList();
			// const mock = await verifyTaskFromAPI(
			// 	{ name: "Task 1", schedule: 10000000 },
			// 	{ strict: false }
			// );
			// console.log("MOCK TEST");
			// dispatch(insertTask(mock));
			// dispatch(selectTask(mock.id));
		})();
	}, []);

	return (
		<div className="app">
			<ReactNotification />
			{panels.status && (
				<Status connection={connection} setStatusUpdating={setStatusUpdating} />
			)}
			<main className={classNames("main", { showTask: panels.task })}>
				<Dropbar />
				<StateTimeline />
				<ValveOverview />
				{selectedTask ? (
					<TopLevelConfig />
				) : (
					<div>Please select a task to configure...</div>
				)}
			</main>
			{panels.task && (
				<div className="task-panel">
					<TaskListing />
				</div>
			)}
			<LoadingScreen hide={loadingScreen.hide} />
		</div>
	);
}
