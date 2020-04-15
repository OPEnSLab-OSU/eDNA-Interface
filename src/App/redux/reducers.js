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

function taskReducer(state = initialTasks, action) {
	const { UPDATE_TASKLIST, UPDATE_TASK, ADD_TASK } = actionTypes;
	const { type, tasklist, taskInfo } = action;

	switch (type) {
	case UPDATE_TASK: 
		return { ...state, [taskInfo.name]: taskInfo };
	case UPDATE_TASKLIST:
		return tasklist;
	default:
		return state;
	}
}

function selectedTaskReducer(state = null, action) {
	const { SELECT_TASK } = actionTypes;
	const { type, name } = action;
	switch (type) {
	case SELECT_TASK:
		return name;
	default:
		return state;
	}
}

function stateTimelineReducer(state = initialStateTimelineData, action) {
	const { STATE_JUMP } = actionTypes;
	const { type } = action;

	switch (type) {
	case STATE_JUMP:
		return state;
	default:
		return state;
	}
}

function valveReducer(state = initialValveData, action) {
	const { TOGGLE_VALVE_SELECTION, VALVE_STATUS_UPDATE } = actionTypes;
	const { type, valveId, payload } = action;

	switch (type) {
	case TOGGLE_VALVE_SELECTION: {
		const selected = state.selected;
		const index = selected.findIndex(id => id === valveId);
		if (index > -1) { 
			return { ...state, selected: selected.filter(id => id !== valveId) };
		} else {
			return { ...state, selected: [...selected, valveId] };
		}
	}
	case VALVE_STATUS_UPDATE:
		return { ...state, all: payload };
	default:
		return state;
	}
}


function stateConfigReducer(state = initialStateConfigs, action) {
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

function loadingScreenReducer(state = { hide: true, show: false }, action) {
	const { LOADING_SCREEN } = actionTypes;
	const { type, value } = action;
	switch (type) {
	case LOADING_SCREEN:
		return { hide: !value, show: value };
	default:
		return state;
	}
}

const rootReducer = combineReducers({ 
	panels: panelReducer, 
	tasks: taskReducer,
	selectedTask: selectedTaskReducer,
	states: stateTimelineReducer,
	valves: valveReducer,
	status: statusReducer,
	connection: connectionReducer,
	displayLoadingScreen: loadingScreenReducer
});

export default rootReducer;