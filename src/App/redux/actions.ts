import { createAction, PrepareAction } from "@reduxjs/toolkit";
import { TaskType } from "App/Models";

const withPayload = <V>(func: (...args: any[]) => V): PrepareAction<V> => {
	return (...args) => ({ payload: func(...args) });
};

// ────────────────────────────────────────────────────── II ──────────
//   :::::: A C T I O N S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────
//
export const togglePanel = createAction(
	"panels/toggle",
	withPayload((panel: string) => ({ panel }))
);

export const setLoadingScreen = createAction(
	"loading-screen/toggle",
	withPayload((showing: boolean) => ({ showing }))
);

// ────────────────────────────────────────────────────────────────────────────────
// ValveOverview
// ────────────────────────────────────────────────────────────────────────────────
// ValveOverview now get data directly from the valve status, the tasks, and the
// current task

// ────────────────────────────────────────────────────────────────────────────────
// Status
// ────────────────────────────────────────────────────────────────────────────────

export const updateStatus = createAction(
	"status/update",
	withPayload((status: object) => ({ status }))
);

// ────────────────────────────────────────────────────────────────────────────────
// Connection
// ────────────────────────────────────────────────────────────────────────────────

export const apiConnect = createAction("CONNECTION_CONNECT");
export const apiTimeout = createAction("CONNECTION_TIMEOUT");
export const apiSuccess = createAction("CONNECTION_SUCCESS");

// ────────────────────────────────────────────────────────────────────────────────
// Tasks
// ────────────────────────────────────────────────────────────────────────────────

export const updateTask = createAction(
	"task/update",
	withPayload((id: string, data: Partial<TaskType>) => ({ id, ...data }))
);

export const toggleTaskValve = createAction(
	"task/toggle-valve",
	withPayload((id: string, valveId: string) => ({ id, valveId }))
);

export const updateTaskList = createAction(
	"tasklist/update",
	withPayload((tasks: TaskType[]) => ({ tasks }))
);

export const selectTask = createAction(
	"task/select",
	withPayload((id: string) => ({ id }))
);
