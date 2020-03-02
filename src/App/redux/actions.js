

const types = { 
	TOGGLE_PANEL: "TOGGLE_PANEL",
	STATE_JUMP: "STATE_JUMP"
};


function togglePanel(panel) {
	return { type: types.TOGGLE_PANEL, panel };
}

function stateJump(newState) {
	return { type: types.STATE_JUMP, newState };
}

export { types, togglePanel, stateJump };