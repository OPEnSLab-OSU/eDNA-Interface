import { types } from "./actions";
import { initialPanelState } from "./states";

import { combineReducers } from "redux";

const { TOGGLE_PANEL } = types;

function panelReducer(state = initialPanelState, action) {
	console.log(action.type);
	switch (action.type) {
	case TOGGLE_PANEL:
		return state;
	default:
		return state;	
	}
}

function groupReducer(state = ["Task 1", "Task 2", "Task 3"], action) {
	console.log(state);
	return state;
}

const rootReducer = combineReducers({ panels: panelReducer, groups: groupReducer });
export default rootReducer;