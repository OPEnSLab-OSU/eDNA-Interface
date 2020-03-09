import { applyMiddleware, createStore } from "redux";
import { actionTypes, updateValveStatus  } from "./actions";
import rootReducer from "./reducers";


const logger = store => next => action => {
	next(action);
};

const valveStatusExtracter = store => next => action => {
	const statusText = ["sampled", "free", "operating"];
	if (action.type === actionTypes.STATUS_UPDATE) {
		const { valves } = action.payload;
		const reduction = valves.reduce((pre, cur, idx) => ([...pre, { id: idx, status: statusText[cur] }]), []);
		store.dispatch(updateValveStatus(reduction));
	}

	next(action);
};

export const store = createStore(rootReducer, 
	applyMiddleware(
		logger,
		valveStatusExtracter
	));