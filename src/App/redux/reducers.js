import { actionTypes } from "./actions";
import {
	initialPanelVisibility,
	initialStateConfigs,
	initialStateTimelineData,
	initialValveInfo
} from "./states";

import { combineReducers } from "redux";

const { TOGGLE_PANEL } = actionTypes;
function panelReducer(state = initialPanelVisibility, action) {
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

const { STATE_JUMP } = actionTypes;
function stateTimelineReducer(state = initialStateTimelineData, action) {
	switch (action.type) {
	case STATE_JUMP:
			
		break;
	default:
		return state;
	}
}

const { TOGGLE_VALVE_SELECTION } = actionTypes;
function valveReducer(valves = initialValveInfo, action) {
	const { valveId } = action;
	switch (action.type) {
	case TOGGLE_VALVE_SELECTION: {

		const index = valves.selected.findIndex(id => id === valveId);
		if (index > -1) { 
			return {
				...valves,
				selected: valves.selected.filter(id => id !== valveId)
			};
		} else {
			return {
				...valves,
				selected: [...valves.selected, valveId]
			};
		}
	}
	default:
		return valves;
	}
}


function stateConfigReducer(configs = initialStateConfigs, action) {
	return configs;
}

const rootReducer = combineReducers({ 
	panels: panelReducer, 
	groups: groupReducer,
	states: stateTimelineReducer,
	valves: valveReducer,
	stateConfigs: stateConfigReducer
});

export default rootReducer;