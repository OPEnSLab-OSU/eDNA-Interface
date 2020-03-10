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

function panelReducer(panels = initialPanelVisibility, action) {
	const { TOGGLE_PANEL } = actionTypes;
	const { type, panel } = action;

	switch (type) {
	case TOGGLE_PANEL:
		return {
			...panels,
			[panel]: !panels[panel],
		};
	default:
		return panels;	
	}
}

function taskReducer(tasks = { all: [], selected: null }, action) {
	const { UPDATE_TASKLIST, UPDATE_TASK, SELECT_TASK } = actionTypes;
	const { type, name, payload } = action;

	const updatedTask = {
		...tasks,
		all: tasks.all.map(t => t.name === name ? Schema.Task({ ...t, ...payload }) : t)
	};

	switch (type) {
	case UPDATE_TASK:	
		return updatedTask;
	case SELECT_TASK:
		return {
			...tasks,
			selected: name
		};
	case UPDATE_TASKLIST:
		console.log("Tasks", action.tasks);

		return {
			...tasks,
			all: action.tasks
		};
	default:
		return tasks;
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

function valveReducer(valves = initialValveData, action) {
	const { TOGGLE_VALVE_SELECTION, VALVE_STATUS_UPDATE } = actionTypes;
	const { type, valveId } = action;

	switch (type) {
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
	case VALVE_STATUS_UPDATE:
		return {
			...valves,
			all: action.payload
		};
	default:
		return valves;
	}
}


function stateConfigReducer(configs = initialStateConfigs, action) {
	return configs;
}


function statusReducer(status = Schema.Status(), action) {
	const { STATUS_UPDATE } = actionTypes;
	const { type, payload } = action;

	switch (type) {
	case STATUS_UPDATE:
		return Schema.Status(payload);
	default:
		return status;
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

	switch (action.type) {
	case CONNECTION_CONNECT:	
		return {
			statusText: "connecting",
			attempts: 0
		};
	case CONNECTION_SUCCESS:
		return {
			statusText: "online",
			attempts: 0
		};
	case CONNECTION_TIMEOUT:
		return {
			statusText: connection.attempts >= 3 ? "offline" : "timeout",
			attempts: connection.attempts + 1
		};
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