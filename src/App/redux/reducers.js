import { actionTypes } from "./actions";
import {
	initialPanelVisibility,
	initialStateConfigs,
	initialStateTimelineData,
	initialStatus,
	initialValveInfo
} from "./states";

import { combineReducers } from "redux";

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

function taskReducer(tasks = ["Task 1", "Task 2", "Task 3"], action) {
	return tasks;
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

function valveReducer(valves = initialValveInfo, action) {
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


function extractStatus(payload) {
	const {
		valves, 
		pressure,
		temperature,
		barometric,
		waterVolume,
		waterDepth 
	} = payload; 

	const currentValve = valves.findIndex(v => parseInt(v) === 2);
	const valveCount = valves.length;

	return [{
		name: "State",
		properties: [
			{ name: "current", value: null }
		]
	}, {
		name: "Valve",
		properties: [
			{ name: "current", value: currentValve }, 
			{ name: "total", value: valveCount }
		]
	}, {
		name: "Sensor Data",
		properties: [
			{ name: "pressure", value: pressure },
			{ name: "temperature", value: temperature },
			{ name: "flow speed", value: null },
			{ name: "Barometric", value: barometric },
			{ name: "water volume:", value: waterVolume },
			{ name: "water depth", value: waterDepth }
		]
	}, {
		name: "Clock",
		properties: [
			{ name: "Local Date", value: null },
			{ name: "Local Time", value: null }
		]
	}];
}

function statusReducer(status = initialStatus, action) {
	const { STATUS_UPDATE } = actionTypes;
	const { type, payload }= action;

	if (!payload) {
		return status;
	}

	switch (type) {
	case STATUS_UPDATE:
		return extractStatus(action.payload);
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