import { actionTypes } from "./actions";
import {
	initialPanelVisibility,
	initialStateConfigs,
	initialStateTimelineData,
	initialStatus,
	initialValveInfo
} from "./states";

import { combineReducers } from "redux";

const { TOGGLE_PANEL } = actionTypes;
function panelReducer(panels = initialPanelVisibility, action) {
	switch (action.type) {
	case TOGGLE_PANEL:
		return {
			...panels,
			[action.panel]: !panels[action.panel],
		};
	default:
		return panels;	
	}
}

function groupReducer(groups = ["Task 1", "Task 2", "Task 3"], action) {
	return groups;
}

const { STATE_JUMP } = actionTypes;
function stateTimelineReducer(state = initialStateTimelineData, action) {
	switch (action.type) {
	case STATE_JUMP:
			
		return state;
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

const { STATUS_UPDATE } = actionTypes;
function statusReducer(status = initialStatus, action) {
	if (!action.payload) {
		return status;
	}

	switch (action.type) {
	case STATUS_UPDATE:
		return extractStatus(action.payload);
	default:
		return status;
	}
}

const rootReducer = combineReducers({ 
	panels: panelReducer, 
	groups: groupReducer,
	states: stateTimelineReducer,
	valves: valveReducer,
	status: statusReducer,
	stateConfigs: stateConfigReducer
});

export default rootReducer;