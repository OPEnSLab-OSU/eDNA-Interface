import { h } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import { Status } from "Components/StatusPanel";
import { TaskConfig } from "Components/TaskConfig";
import { TaskListing } from "Components/TaskListing";
import { Dropbar } from "Components/Dropbar";
import { StateTimeline } from "Components/StateTimeline";
import { StateConfig } from "Components/StateConfig";

import { useDispatch, useSelector, useStore } from "react-redux";
import { ValveOverview } from "../Components/ValveOverview";

import { sleep } from "Util/timeout";
import { fetchWithTimeout } from "../Util/timeout";

import { apiConnect, apiSuccess, apiTimeout, updateStatus } from "./redux/actions";


const base = new URL("http://192.168.1.1");

const start = Date.now();
function fetchStatus(timeout) {
	console.log("Fetching", (Date.now() - start)/1000);
	const url = new URL("api/status", base);
	const controller = new AbortController();
	const signal = controller.signal;

	window.onunload = () => controller.abort();
	// -10 to make timeout event trigger before the setInterval
	setTimeout(() => controller.abort(), timeout - 10); 
	return fetch(url, { signal }).then(response => response.json());
}


export function App() {
	const store = useStore();
	const dispatch = useDispatch();
	const panels = useSelector(state => state.panels);
	const connection = useSelector(state => state.connection);
	const [statusUpdating, setStatusUpdating] = useState(true);

	// Status update effect 
	useEffect(() => {
		if (!statusUpdating) {
			return;
		}
			
		const timeout = 500;
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

	return (
		<div className="app">
			<Status connection={connection} setStatusUpdating={setStatusUpdating}/>
			<main className="main">
				<Dropbar />
				<StateTimeline />
				<ValveOverview />
				<StateConfig />
			</main>
			<TaskConfig expanded={panels.task}/>
			<TaskListing />
		</div>
	);
}