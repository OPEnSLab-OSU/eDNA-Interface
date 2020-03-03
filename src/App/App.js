import { h } from "preact";
import { useState } from "preact/hooks";

import { Status } from "Components/StatusPanel";
import { TaskConfig } from "Components/TaskConfig";
import { TaskListing } from "Components/TaskListing";
import { Dropbar } from "Components/Dropbar";
import { StateTimeline } from "Components/StateTimeline";

import { useSelector } from "react-redux";
import { ValveOverview } from "../Components/ValveOverview";

export function App() {
	const panels = useSelector(state => state.panels);

	return (
		<div className="app">
			<Status />
			<main className="main">
				<Dropbar />
				<StateTimeline />
				<ValveOverview />
			</main>
			<TaskConfig expanded={panels.task}/>
			<TaskListing />
		</div>
	);
}