import { combineReducers, configureStore, Middleware } from "@reduxjs/toolkit";

import {
	insertTask,
	replaceTaskList,
	setValveOverview,
	statusUpdate,
	toggleTaskValve,
	updateTask,
} from "./actions";
import * as reducers from "./reducers";

const logger: Middleware = (store) => (next) => (action) => {
	next(action);
};

const valveStatusExtractor: Middleware = (store) => (next) => (action) => {
	const statusText = new Map<number, string>();
	statusText.set(-1, "unavailable");
	statusText.set(0, "sampled");
	statusText.set(1, "free");
	statusText.set(2, "operating");

	if (action.type === statusUpdate.type) {
		const statusUpdateAction = action as ReturnType<typeof statusUpdate>;
		const mappedValvesFromStatus = statusUpdateAction.payload.valves?.map(
			(valveStatus, index) => ({
				id: index,
				status: statusText.get(valveStatus)!,
			})
		);

		if (mappedValvesFromStatus) {
			store.dispatch(setValveOverview(mappedValvesFromStatus));
		}
	}

	next(action);
};

const rootReducer = combineReducers(reducers);
export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					updateTask.type,
					insertTask.type,
					replaceTaskList.type,
					toggleTaskValve.type,
				],
				ignoredPaths: ["tasks"],
			},
		})
			.concat(valveStatusExtractor)
			.concat(logger),
});
export type RootState = ReturnType<typeof rootReducer>;
