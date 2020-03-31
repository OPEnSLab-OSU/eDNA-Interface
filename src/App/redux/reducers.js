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
	const { UPDATE_TASKLIST, UPDATE_TASK, ADD_TASK, SELECT_TASK } = actionTypes;
	const { type, name, payload } = action;

	switch (type) {
	case UPDATE_TASK: {
		const newTasks = state.all.map(t => {
			return t.name === name ? Schema.Task.cast(payload) : t;
		});

		return { ...state, all: newTasks };
	}
	case ADD_TASK:
		return { ...state, all: [...state.all, Schema.Task.cast(action.task)] };
	case SELECT_TASK:
		return { ...state, selected: name };
	case UPDATE_TASKLIST:
		return { ...state, all: action.tasks };
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
	states: stateTimelineReducer,
	valves: valveReducer,
	status: statusReducer,
	stateConfigs: stateConfigReducer,
	connection: connectionReducer
});

export default rootReducer;