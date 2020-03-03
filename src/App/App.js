import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import { Status } from "Components/StatusPanel";
import { TaskConfig } from "Components/TaskConfig";
import { TaskListing } from "Components/TaskListing";
import { Dropbar } from "Components/Dropbar";
import { StateTimeline } from "Components/StateTimeline";
import { StateConfig } from "Components/StateConfig";

import { useDispatch, useSelector } from "react-redux";
import { ValveOverview } from "../Components/ValveOverview";

import { sleep } from "Util/timeout";
import { STATUS_SUCCESS, STATUS_TIMEOUT, useAPIStatusProvider } from "../Hooks/useAPIStatusProvider";
import { fetchWithTimeout } from "../Util/timeout";

const base = new URL("192.168.1.1");
const abortController = new AbortController();

async function fetchStatus() {
	// const url = "https://jsonplaceholder.typicode.com/todos/1";
	const url = new URL("api/status", base);
	const signal = abortController.signal;
	try {
		const response = await fetchWithTimeout(3000, url, { signal });
		console.log(response);
	} catch (error) {
		console.log(error);
	}
}
export function App() {
	const panels = useSelector(state => state.panels);
	const dispatch = useDispatch();

	useEffect(() => {
		const timerId = setInterval(() => {
			fetchStatus();
		}, 3000);
		return () => {
			clearInterval(timerId);
		};
	}, []);

	return (
		<div className="app">
			<Status connectionStatus={status}/>
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