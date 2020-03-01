

const types = { TOGGLE_PANEL: "TOGGLE_PANEL" };


function togglePanel(panel) {
	return { type: types.TOGGLE_PANEL, panel: panel };
}

export { types, togglePanel };