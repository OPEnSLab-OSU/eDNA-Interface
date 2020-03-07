import { applyMiddleware, createStore } from "redux";
import rootReducer from "./reducers";


const logger = store => next => action => {
	next(action);
	console.log(store.getState().valves.selected);
};

export const store = createStore(rootReducer, applyMiddleware(logger));