import { actionTypes } from "./actions";
import {
	initialPanelVisibility,
	initialStateConfigs,
	initialStateTimelineData,
	initialTasks,
	initialValveData
} from "./initial-states";

import { combineReducers } from "redux";
import Schema from "App/Schema";

//
// ────────────────────────────────────────────────────── I ──────────
//   :::::: H E L P E R S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────
//


function ifElse(condition, value1, value2) {
	return condition ? value1 : value2;
}

//
// ──────────────────────────────────────────────────────── II ──────────
//   :::::: R E D U C E R S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────
//



function panels(state = initialPanelVisibility, action) {
	const { TOGGLE_PANEL } = actionTypes;
	const { type, panel } = action;

	switch (type) {
	case TOGGLE_PANEL:
		return { ...state, [panel]: !state[panel], };
	default:
		return state;	
	}
}

function tasks(state = initialTasks, action) {
	const {
		UPDATE_TASKLIST, 
		UPDATE_TASK,
		TASK_TOGGLE_VALVE
	} = actionTypes;
	const { type, tasklist, taskInfo, name, valveId } = action;

	switch (type) {
	case UPDATE_TASK: 
		return { ...state, [taskInfo.name]: taskInfo };
	case TASK_TOGGLE_VALVE: {
		const task = state[name];
		const valves = task.valves;
		const index = valves.findIndex(id => id === valveId);
		const new_task = ifElse(index > -1, 
			{ ...task, valves: valves.filter(id => id !== valveId) },
			{ ...task, valves: [...valves, valveId] }
		);

		return { ...state, [name]: new_task };
	}
	case UPDATE_TASKLIST:
		return tasklist;
	default:
		return state;
	}
}

function selectedTask(state = null, action) {
	const { SELECT_TASK } = actionTypes;
	const { type, name } = action;
	switch (type) {
	case SELECT_TASK:
		return name;
	default:
		return state;
	}
}

function states(state = initialStateTimelineData, action) {
	const { STATE_JUMP } = actionTypes;
	const { type } = action;

	switch (type) {
	case STATE_JUMP:
		return state;
	default:
		return state;
	}
}

function valves(state = initialValveData, action) {
	const {
		TOGGLE_VALVE_SELECTION, 
		VALVE_STATUS_UPDATE,
		CLEAR_VALVE_SELECTION,
		SET_VALVE_SELECTIONS
	} = actionTypes;
	const { type, valveId, payload, valveIds } = action;

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
	case CLEAR_VALVE_SELECTION: 
		return { ...state, selected: [] };
	case SET_VALVE_SELECTIONS:
		return { ...state, selected: valveIds };
	case VALVE_STATUS_UPDATE:
		return { ...state, all: payload };
	default:
		return state;
	}
}


function stateConfigReducer(state = initialStateConfigs, action) {
	return state;
}

function displayLoadingScreen(state = { hide: true, show: false }, action) {
	const { LOADING_SCREEN } = actionTypes;
	const { type, value } = action;
	switch (type) {
	case LOADING_SCREEN:
		return { hide: !value, show: value };
	default:
		return state;
	}
}

function status(state = Schema.Status.default(), action) {
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

function connection(connection = initialConnection, action) {
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
	panels, 
	tasks,
	selectedTask,
	states: states,
	valves,
	status,
	connection,
	displayLoadingScreen
});

export default rootReducer;