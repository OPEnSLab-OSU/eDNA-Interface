import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Dropbar } from "Components/Dropbar";
import { StateTimeline } from "Components/StateTimeline";
import { Status } from "Components/StatusPanel";
import { TaskListing } from "Components/TaskListing";
import { TopLevelConfig } from "Components/TopLevelConfig";
import { LoadingScreen } from "Components/LoadingScreen";
import { ValveOverview } from "Components/ValveOverview";
import { FormContext, useForm } from "react-hook-form";
import classNames from "classnames";
import { API } from "./API";
import { RootState } from "./redux/store";
import { apiConnect } from "./redux/actions";

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

		let timerId: number | null = null;
		const timeout = 1000;
		const statusUpdate = async () => {
			try {
				await API.store.getStatus(timeout);
			} catch (error) {
				if (store.getState().connection.statusText === "offline") {
					timerId && clearInterval(timerId);
					setStatusUpdating(false);
				}
			}
		};

		dispatch(apiConnect());
		statusUpdate();

		timerId = window.setInterval(() => statusUpdate(), timeout);
		return () => timerId && clearInterval(timerId);
	}, [statusUpdating, dispatch, store]);

	return [statusUpdating, setStatusUpdating] as const;
}

export function App() {
	const dispatch = useDispatch();
	const panels = useSelector((state: RootState) => state.panels);
	const connection = useSelector((state: RootState) => state.connection);
	const loadingScreen = useSelector((state: RootState) => state.loadingScreen);
	const [, setStatusUpdating] = useStatusUpdating();

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
			{panels.status && (
				<Status connection={connection} setStatusUpdating={setStatusUpdating} />
			)}
			<main className={classNames("main", { showTask: panels.task })}>
				<Dropbar />
				<StateTimeline />
				<ValveOverview />
				<TopLevelConfig />
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

// export const App: React.FC = () => {
// 	const methods = useForm();
// 	return (
// 		<FormContext {...methods}>
// 			<TextFieldComponent name="text" title="asdf" />
// 		</FormContext>
// 	);
// };
