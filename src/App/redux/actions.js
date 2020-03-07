

const types = { 
	TOGGLE_PANEL: "TOGGLE_PANEL",
	STATE_JUMP: "STATE_JUMP",
	TOGGLE_VALVE_SELECTION: "TOGGLE_VALVE_SELECTION",
	STATUS_UPDATE: "STATUS_UPDATE"
};


function togglePanel(panel) {
	return { type: types.TOGGLE_PANEL, panel };
}

function stateJump(newState) {
	return { type: types.STATE_JUMP, newState };
}

function toggleValveSelection(valveId) {
	return { type: types.TOGGLE_VALVE_SELECTION, valveId };
} 


function updateStatus(payload) {
	return { type: types.STATUS_UPDATE, payload };
}

export {
	types as actionTypes,
	togglePanel,
	stateJump,
	toggleValveSelection,
	updateStatus
};