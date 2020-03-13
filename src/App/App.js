import { h } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { useDispatch, useSelector, useStore } from "react-redux";
import { apiConnect, apiSuccess, apiTimeout, updateStatus, updateTaskList } from "./redux/actions";

import { Dropbar, StateConfig, StateTimeline, Status, TaskConfig, TaskListing, ValveOverview } from "Components";
import { base } from "./Static.js";

const start = Date.now();
function fetchStatus(timeout) {
	console.log("Fetching", (Date.now() - start) / 1000);
	const url = new URL("api/status", base);
	const controller = new AbortController();
	const signal = controller.signal;

	window.onunload = () => controller.abort();
	setTimeout(() => controller.abort(), timeout - 10);  // -10 to make timeout event trigger before the setInterval
	return fetch(url, { signal }).then(response => response.json());
}


export function App() {
	const store = useStore();
	const dispatch = useDispatch();
	const panels = useSelector(state => state.panels);
	const connection = useSelector(state => state.connection);
	const [statusUpdating, setStatusUpdating] = useState(false);

	// Status update effect 
	useEffect(() => {
		if (!statusUpdating) {
			return;
		}
			
		const timeout = 1000;
		const fetchHandleStatusUpdate = (timerId = null) => {
			fetchStatus(timeout).then(payload => {
				dispatch(updateStatus(payload));
				dispatch(apiSuccess());
			}).catch(_ => {
				dispatch(apiTimeout());
				if (store.getState().connection.statusText === "offline") {
					clearInterval(timerId);
					setStatusUpdating(false);
				} 
			});
		};

		dispatch(apiConnect());
		fetchHandleStatusUpdate();
		const timer = setInterval(() => fetchHandleStatusUpdate(timer), timeout);
		return () => clearInterval(timer);
	}, [statusUpdating]);

	// Get taskrefs
	useEffect(() => {
		fetch(new URL("/api/taskrefs", base)).then(res => res.json()).then(tasks => {
			dispatch(updateTaskList(tasks));
		});
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