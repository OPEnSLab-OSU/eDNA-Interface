import { combineReducers, Middleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import {
	statusUpdate,
	setValveOverview,
	updateTask,
	insertTask,
	replaceTaskList,
	toggleTaskValve,
} from "./actions";
import * as reducers from "./reducers";

const logger: Middleware = store => next => action => {
	next(action);
	console.log(store.getState());
};

const valveStatusExtractor: Middleware = store => next => action => {
	const statusText = ["sampled", "free", "operating"];
	if (action.type === statusUpdate.type) {
		const statusUpdateAction = action as ReturnType<typeof statusUpdate>;
		const mappedValvesFromStatus = statusUpdateAction.payload.valves?.map(
			(valveStatus, index) => ({
				id: index,
				status: statusText[valveStatus],
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
	middleware: getDefaultMiddleware =>
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
