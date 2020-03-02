import { types } from "./actions";
import { initialPanelState, initialStateTimeline } from "./states";

import { combineReducers } from "redux";

const { TOGGLE_PANEL } = types;
function panelReducer(state = initialPanelState, action) {
	switch (action.type) {
	case TOGGLE_PANEL:
		return {
			...state,
			[action.panel]: !state[action.panel],
		};
	default:
		return state;	
	}
}

function groupReducer(state = ["Task 1", "Task 2", "Task 3"], action) {
	return state;
}

const { STATE_JUMP } = types;
function stateTimelineReducer(state = initialStateTimeline, action) {
	switch (action.type) {
	case STATE_JUMP:
			
		break;
	
	default:
		break;
	}
	return state;
}

const rootReducer = combineReducers({ 
	panels: panelReducer, 
	groups: groupReducer,
	states: stateTimelineReducer 
});

export default rootReducer;