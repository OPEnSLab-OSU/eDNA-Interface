

const types = { 
	TOGGLE_PANEL: "TOGGLE_PANEL",
	STATE_JUMP: "STATE_JUMP",
	TOGGLE_VALVE_SELECTION: "TOGGLE_VALVE_SELECTION"
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

export {
	types as actionTypes,
	togglePanel,
	stateJump,
	toggleValveSelection
};