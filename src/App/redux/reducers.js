import { actionTypes } from "./actions";
import {
	initialPanelVisibility,
	initialStateTimelineData,
	initialTasks,
	initialValveData,
} from "./states";

import * as models from "App/Models";

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

// ────────────────────────────────────────────────────────────────────────────────
// Representing the visibility all panels currently on screen
// ────────────────────────────────────────────────────────────────────────────────
export function panels(state = initialPanelVisibility, action) {
	const { TOGGLE_PANEL } = actionTypes;
	const { type, panel } = action;

	switch (type) {
	case TOGGLE_PANEL:
		return { ...state, [panel]: !state[panel] };
	default:
		return state;	
	}
}

export function tasks(state = initialTasks, action) {
	const {
		UPDATE_TASKLIST, 
		UPDATE_TASK,
		TOGGLE_TASK_VALVE,
	} = actionTypes;

	const { type, tasklist, data, taskId, valveId } = action;

	switch (type) {
	case UPDATE_TASK: 
		return { ...state, [data.name]: data };
	case UPDATE_TASKLIST:
		return tasklist;
	case TOGGLE_TASK_VALVE: {
		const task = state[taskId];
		const valves = task.valves;
		const index = valves.findIndex(id => id === valveId);
		const new_task = ifElse(index > -1, 
			{ ...task, valves: valves.filter(id => id !== valveId) },
			{ ...task, valves: [...valves, valveId] },
		);
	
		return { ...state, [taskId]: new_task };
	}
	default:
		return state;
	}
}

// ────────────────────────────────────────────────────────────────────────────────
// For selected task name. Client should get the actual task object from
// state.tasks
// ────────────────────────────────────────────────────────────────────────────────
export function selectedTask(state = null, action) {
	const { SELECT_TASK } = actionTypes;
	const { type, taskId } = action;
	switch (type) {
	case SELECT_TASK:
		return taskId;
	default:
		return state;
	}
}


// ────────────────────────────────────────────────────────────────────────────────
// Representing the state of the stateTimeline
// ────────────────────────────────────────────────────────────────────────────────
export function stateTimeline(state = initialStateTimelineData, action) {
	const { STATE_JUMP } = actionTypes;
	const { type } = action;
	switch (type) {
	case STATE_JUMP:
		return state;
	default:
		return state;
	}
}


// ────────────────────────────────────────────────────────────────────────────────
// The final representation of valve overview is done by merge together the base
// valve array and †he valves associated with the task.
// ────────────────────────────────────────────────────────────────────────────────
export function valves(state = initialValveData, action) {
	const {
		TOGGLE_VALVE_SELECTION, 
		UPDATE_VALVE_STATUS,
		CLEAR_VALVE_SELECTION,
		SET_VALVE_SELECTIONS,
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
	case UPDATE_VALVE_STATUS:
		return { ...state, all: payload };
	default:
		return state;
	}
}


// ────────────────────────────────────────────────────────────────────────────────
// Representing the state of the loading screen
// ────────────────────────────────────────────────────────────────────────────────
export function loadingScreen(state = { hide: true, show: false }, action) {
	const { LOADING_SCREEN } = actionTypes;
	const { type, value } = action;
	switch (type) {
	case LOADING_SCREEN:
		return { hide: !value, show: value };
	default:
		return state;
	}
}

// ────────────────────────────────────────────────────────────────────────────────
// State reducer for the general status of the sampler
// ────────────────────────────────────────────────────────────────────────────────
export function status(state = models.StatusSchema.default(), action) {
	const { STATUS_UPDATE } = actionTypes;
	const { type, payload } = action;

	switch (type) {
	case STATUS_UPDATE:
		return models.StatusSchema.cast(payload);
	default:
		return state;
	}
}

// ────────────────────────────────────────────────────────────────────────────────
// Keeping track of the state of the status connection.
// ────────────────────────────────────────────────────────────────────────────────
export function connection(connection = { statusText: "offline", attempts: 0 }, action) {
	const {
		CONNECTION_CONNECT, 
		CONNECTION_SUCCESS,
		CONNECTION_TIMEOUT, 
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

