import { createReducer, Dictionary } from "@reduxjs/toolkit";

import { Status, Task, Valve } from "App/redux/models";

import { arrayToObject } from "Util";

import * as actions from "./actions";

//
// ────────────────────────────────────────────────────── I ──────────
//   :::::: H E L P E R S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────
//

function ifElse<B extends boolean, T, K>(c: B, a: T, b: K) {
	return c ? a : b;
}

//
// ──────────────────────────────────────────────────────── II ──────────
//   :::::: R E D U C E R S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────
//

// ────────────────────────────────────────────────────────────────────────────────
// Representing the visibility all panels currently on screen
// ────────────────────────────────────────────────────────────────────────────────
export const panels = createReducer({ status: true, task: true }, (builder) =>
	builder.addCase(actions.togglePanel, (state, { payload }) => ({
		...state,
		...payload,
	}))
);

// ────────────────────────────────────────────────────────────────────────────────
// Reducer for all tasks object
// ────────────────────────────────────────────────────────────────────────────────
export const tasks = createReducer<Dictionary<Task>>({}, (builder) =>
	builder
		.addCase(actions.updateTask, (state, { payload }) => {
			const task = state[payload.id];
			if (task) {
				return { ...state, [task.id]: { ...task, ...payload } };
			}
		})
		.addCase(actions.insertTask, (state, { payload }) => {
			const { data } = payload;
			return { ...state, [data.id]: data };
		})
		.addCase(actions.replaceTaskList, (_, { payload }) => {
			return arrayToObject(payload.tasks, "id");
		})
		.addCase(actions.toggleTaskValve, (state, { payload }) => {
			const { id: taskId, valveId } = payload;
			const task = state[taskId];
			if (!task) {
				return;
			}

			const { valves } = task;
			const index = valves.findIndex((id) => id === valveId);
			const newTask = ifElse(
				index > -1,
				{ ...task, valves: valves.filter((id) => id !== valveId) },
				{ ...task, valves: [...valves, valveId] }
			);

			return { ...state, [taskId]: newTask };
		})
);

// ────────────────────────────────────────────────────────────────────────────────
// For selected task name. Client should get the actual task object from
// state.tasks
// ────────────────────────────────────────────────────────────────────────────────
export const selectedTask = createReducer(0, (builder) =>
	builder.addCase(actions.selectTask, (_, { payload }) => payload.id)
);

// ────────────────────────────────────────────────────────────────────────────────
// The final representation of valve overview is done by merge together the base
// valve array and †he valves associated with the task.
// ────────────────────────────────────────────────────────────────────────────────
const initialValves: { all: Valve[] } = {
	all: Array.from({ length: 24 }, (_, id) => ({
		id,
		status: "sampled",
		isSelected: true,
	})),
};

export const valves = createReducer(initialValves, (builder) =>
	builder.addCase(actions.setValveOverview, (state, { payload }) => {
		payload.valves.forEach((v) => {
			state.all[v.id] = v;
		});
	})
);

// ────────────────────────────────────────────────────────────────────────────────
// Representing the state of the loading screen
// ────────────────────────────────────────────────────────────────────────────────
const initialLoadingScreen = { show: false, hide: true };
export const loadingScreen = createReducer(initialLoadingScreen, (builder) =>
	builder.addCase(actions.setDisplayLoadingScreen, (_, { payload }) => ({
		show: payload.showing,
		hide: !payload.showing,
	}))
);

// ────────────────────────────────────────────────────────────────────────────────
// State reducer for the general status of the sampler
// ────────────────────────────────────────────────────────────────────────────────
const initialStatus: Status = { valves: Array.from({ length: 24 }, () => 0) };
export const status = createReducer<Status>(initialStatus, (builder) =>
	builder.addCase(actions.statusUpdate, (state, { payload }) => ({
		...state,
		...payload,
	}))
);

// ────────────────────────────────────────────────────────────────────────────────
// Keeping track of the state of the status connection.
// ────────────────────────────────────────────────────────────────────────────────
const initialConnection = { statusText: "offline", attempts: 0 };
export const connection = createReducer(initialConnection, (builder) =>
	builder
		.addCase(actions.apiConnect, () => ({
			statusText: "connecting",
			attempts: 0,
		}))
		.addCase(actions.apiSuccess, () => ({
			statusText: "online",
			attempts: 0,
		}))
		.addCase(actions.apiTimeout, (state) => ({
			statusText: state.attempts >= 3 ? "offline" : "timeout",
			attempts: state.attempts + 1,
		}))
);
