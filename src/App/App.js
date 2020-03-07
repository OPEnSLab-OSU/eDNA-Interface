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
import { fetchWithTimeout } from "../Util/timeout";

import { updateStatus } from "./redux/actions";


const base = new URL("http://192.168.1.1");
const controller = new AbortController();

function fetchStatus() {
	const signal = controller.signal;

	window.onunload = () => {
		controller.abort();
	};
	
	setTimeout(() => {
		controller.abort();
	}, 3000);

	const url = new URL("api/status", base);
	return fetch(url, { signal }).then(response => response.json());
}

export function App() {
	const panels = useSelector(state => state.panels);
	const dispatch = useDispatch();

	useEffect(() => {
		const timerId = setInterval(() => {
			fetchStatus().then(payload => {
				dispatch(updateStatus(payload));
			}).catch(error => {
				console.log("Timeout", error);
			});
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