import { actionTypes } from "./actions";
import {
	initialPanelVisibility,
	initialStateConfigs,
	initialStateTimelineData,
	initialTasks,
	initialValveData
} from "./states";

import { combineReducers } from "redux";
import Schema from "App/Schema";

function panelReducer(state = initialPanelVisibility, action) {
	const { TOGGLE_PANEL } = actionTypes;
	const { type, panel } = action;

	switch (type) {
	case TOGGLE_PANEL:
		return { ...state, [panel]: !state[panel], };
	default:
		return state;	
	}
}

function taskReducer(state = initialTasks, action) {
	const { UPDATE_TASKLIST, UPDATE_TASK } = actionTypes;
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

function statusReducer(state = Schema.Status.default(), action) {
	const { STATUS_UPDATE } = actionTypes;
	const { type, payload } = action;

	switch (type) {
	case STATUS_UPDATE:
		return Schema.Status.cast(payload);
	default:
		return state;
	}
}

const initialConnection = {
	statusText: "offline",
	attempts: 0
};

function connectionReducer(connection = initialConnection, action) {
	const {
		CONNECTION_CONNECT, 
		CONNECTION_SUCCESS,
		CONNECTION_TIMEOUT 
	} = actionTypes;

	const { attempts } = connection;

	switch (action.type) {
	case CONNECTION_CONNECT:	
		return { statusText: "connecting", attempts: 0 };
	case CONNECTION_SUCCESS:
		return { statusText: "online", attempts: 0 };
	case CONNECTION_TIMEOUT:
		return { statusText: attempts >= 3 ? "offline" : "timeout", attempts: attempts + 1 };
	default:
		return connection;
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