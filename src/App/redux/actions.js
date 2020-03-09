const types = { 
	TOGGLE_PANEL: "TOGGLE_PANEL",
	STATE_JUMP: "STATE_JUMP",
	TOGGLE_VALVE_SELECTION: "TOGGLE_VALVE_SELECTION",
	STATUS_UPDATE: "STATUS_UPDATE",
	VALVE_STATUS_UPDATE: "VALVE_STATUS_UPDATE",
	CONNECTION_CONNECT: "connect",
	CONNECTION_TIMEOUT: "timeout",
	CONNECTION_SUCCESS: "success"
};

function togglePanel(panel) {
	return { type: types.TOGGLE_PANEL, panel };
}

function stateTransition(newState) {
	return { type: types.STATE_JUMP, newState };
}

function toggleValveSelection(valveId) {
	return { type: types.TOGGLE_VALVE_SELECTION, valveId };
} 

function updateStatus(payload, success) {
	return { type: types.STATUS_UPDATE, payload, success };
}

function updateValveStatus(payload) {
	return { type: types.VALVE_STATUS_UPDATE, payload };
}

function apiConnect() {
	return { type: types.CONNECTION_CONNECT };
}

function apiTimeout() {
	return { type: types.CONNECTION_TIMEOUT };
}

function apiSuccess() {
	return { type: types.CONNECTION_SUCCESS };
}

export {
	types as actionTypes,
	togglePanel,
	stateTransition,
	toggleValveSelection,
	updateStatus,
	updateValveStatus,
	apiConnect,
	apiTimeout,
	apiSuccess
};