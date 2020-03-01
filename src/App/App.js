import { h } from "preact";

import { useState } from "preact/hooks";

import { css } from "@emotion/core";

import { AppContext, AppContextProvider } from "./AppContext.js";

import { Status } from "Components/StatusPanel";
import { TaskConfig } from "Components/TaskConfig";
import { TaskListing } from "Components/TaskListing";
import { Dropbar } from "Components/Dropbar";


import { Provider } from "react-redux";
import { store } from "./redux/store";

export function App() {
	return (
		<Provider store={store}>
			<div className="app">
				<Status />
				<main className="main">
					<Dropbar />
				</main>
				<TaskConfig />
				<TaskListing />
			</div>
		</Provider>
	);
}