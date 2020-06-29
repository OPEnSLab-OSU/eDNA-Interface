import { createAction } from "@reduxjs/toolkit";
import { Task, Status, Valve } from "App/redux/models";

const withPayload = <K extends any[], V>(func: (...args: K) => V) => {
	return (...args: K) => ({ payload: func(...args) });
};

// ────────────────────────────────────────────────────── II ──────────
//   :::::: A C T I O N S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────
//
export const togglePanel = createAction(
	"panels/toggle",
	withPayload((panel: string) => ({ panel }))
);

export const setDisplayLoadingScreen = createAction(
	"loading-screen/toggle",
	withPayload((showing: boolean) => ({ showing }))
);

// ────────────────────────────────────────────────────────────────────────────────
// ValveOverview
// ────────────────────────────────────────────────────────────────────────────────
// ValveOverview now get data directly from the valve status, the tasks, and the
// current task
export const setValveOverview = createAction(
	"valveOverview/set",
	withPayload((valves: Valve[]) => ({ valves }))
);

// ────────────────────────────────────────────────────────────────────────────────
// Status
// ────────────────────────────────────────────────────────────────────────────────
export const statusUpdate = createAction(
	"status/update",
	withPayload((status: Status) => ({ ...status }))
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
	withPayload((id: number, data: Partial<Task>) => ({ ...data, id }))
);

export const insertTask = createAction(
	"task/create",
	withPayload((data: Task) => ({ data }))
);

export const toggleTaskValve = createAction(
	"task/toggle-valve",
	withPayload((id: number, valveId: number) => ({ id, valveId }))
);

export const replaceTaskList = createAction(
	"tasklist/replace",
	withPayload((tasks: Task[]) => ({ tasks }))
);

export const selectTask = createAction(
	"task/select",
	withPayload((id: number) => ({ id }))
);
