//
// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: A C T I O N   T Y P E S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//

const types = { 
	TOGGLE_PANEL: "",
	STATE_JUMP: "",
	TOGGLE_VALVE_SELECTION: "",
	STATUS_UPDATE: "",
	VALVE_STATUS_UPDATE: "",
	CONNECTION_CONNECT: "",
	CONNECTION_TIMEOUT: "",
	CONNECTION_SUCCESS: "",
	ADD_TASK: "",
	UPDATE_TASK: "",
	UPDATE_TASKLIST: "",
	SELECT_TASK: "",
	LOADING_SCREEN: "",
	CLEAR_VALVE_SELECTION: "",
	SET_VALVE_SELECTIONS: "",
	TASK_TOGGLE_VALVE: ""
};Object.keys(types).forEach(k => types[k] = k);


//
// ────────────────────────────────────────────────────── II ──────────
//   :::::: A C T I O N S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────
//

function togglePanel(panel) {
	return { type: types.TOGGLE_PANEL, panel };
}

function stateTransition(newState) {
	return { type: types.STATE_JUMP, newState };
}

function toggleValveSelection(valveId) {
	return { type: types.TOGGLE_VALVE_SELECTION, valveId };
} 

function setValveSelections(valveIds) {
	return { type: types.SET_VALVE_SELECTIONS, valveIds };
}

function clearValveSelection() {
	return { type: types.CLEAR_VALVE_SELECTION };
}

function updateStatus(payload) {
	return { type: types.STATUS_UPDATE, payload };
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

function updateTask(taskInfo) {
	return { type: types.UPDATE_TASK, taskInfo };
}

function toggleTaskValve(name, valveId) {
	return { type: types.TASK_TOGGLE_VALVE, name, valveId };
}

function updateTaskList(tasklist) {
	return { type: types.UPDATE_TASKLIST, tasklist };
}

function selectTask(name) {
	return { type: types.SELECT_TASK, name };
}

function setDisplayLoadingScreen(bool) {
	return { type: types.LOADING_SCREEN, value: bool };
}

//
// ────────────────────────────────────────────────────── III ──────────
//   :::::: E X P O R T S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────
//

export {
	types as actionTypes,
	togglePanel,
	stateTransition,
	toggleValveSelection,
	setValveSelections,
	clearValveSelection,
	updateStatus,
	updateValveStatus,
	updateTask,
	updateTask as updateTaskInfo,
	toggleTaskValve,
	selectTask,
	updateTaskList,
	setDisplayLoadingScreen,
	apiConnect,
	apiTimeout,
	apiSuccess,
};