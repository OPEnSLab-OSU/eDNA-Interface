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
	UPDATE_VALVE_STATUS: "",
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
	TOGGLE_TASK_VALVE: "",
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

// ────────────────────────────────────────────────────────────────────────────────
// ValveOverview 
// ────────────────────────────────────────────────────────────────────────────────

function toggleValveSelection(valveId) {
	return { type: types.TOGGLE_VALVE_SELECTION, valveId };
} 

function setValveSelections(valveIds) {
	return { type: types.SET_VALVE_SELECTIONS, valveIds };
}

function clearValveSelection() {
	return { type: types.CLEAR_VALVE_SELECTION };
}


function updateValveStatus(payload) {
	return { type: types.UPDATE_VALVE_STATUS, payload };
}

// ────────────────────────────────────────────────────────────────────────────────
// Status 
// ────────────────────────────────────────────────────────────────────────────────

function updateStatus(payload) {
	return { type: types.STATUS_UPDATE, payload };
}

// ────────────────────────────────────────────────────────────────────────────────
// Connection 
// ────────────────────────────────────────────────────────────────────────────────

function apiConnect() {
	return { type: types.CONNECTION_CONNECT };
}

function apiTimeout() {
	return { type: types.CONNECTION_TIMEOUT };
}

function apiSuccess() {
	return { type: types.CONNECTION_SUCCESS };
}

// ────────────────────────────────────────────────────────────────────────────────
// Tasks
// ────────────────────────────────────────────────────────────────────────────────

function updateTask(data) {
	return { type: types.UPDATE_TASK, data };
}

function toggleTaskValve(taskId, valveId) {
	return { type: types.TOGGLE_TASK_VALVE, taskId, valveId };
}

function updateTaskList(tasklist) {
	return { type: types.UPDATE_TASKLIST, tasklist };
}

function selectTask(taskId) {
	return { type: types.SELECT_TASK, taskId };
}

function setLoadingScreen(bool) {
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
	setLoadingScreen as setDisplayLoadingScreen,
	apiConnect,
	apiTimeout,
	apiSuccess,
};