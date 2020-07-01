import { store } from "./redux/store";
import { base } from "./Static";
import {
	apiSuccess,
	apiTimeout,
	selectTask,
	statusUpdate,
	updateTask,
	replaceTaskList,
	insertTask,
} from "./redux/actions";

import { objectToQueryString, arrayToObject } from "Util";
import { createTask, Task } from "./redux/models";

//
// ────────────────────────────────────────────── II ──────────
//   :::::: A P I : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────
//

class APIBuilder {
	controller!: AbortController;
	timeout!: number;

	constructor(public path: string, public options: any) {
		this.path = path;
		this.options = options;
	}

	withTimeout(millis: number) {
		this.controller = new AbortController();
		this.timeout = millis;
		this.options = { ...this.options, signal: this.controller.signal };
		return this;
	}

	body(payload: any) {
		this.options = { ...this.options, body: payload };
		return this;
	}

	json(payload: any) {
		return this.body(JSON.stringify(payload));
	}

	query(params: any) {
		this.path += "?" + objectToQueryString(params);
	}

	async send() {
		if (this.controller) {
			setTimeout(() => this.controller.abort(), this.timeout - 10);
		}

		const path = new URL(this.path, base);
		const response = await fetch(path.toString(), this.options);
		return response.json();
	}
}

const get = (path: string, options = {}) =>
	new APIBuilder(path, { method: "GET", ...options });

const post = (path: string, options = {}) =>
	new APIBuilder(path, { method: "POST", ...options });

async function getStatus(timeout: number) {
	try {
		const status = await get("api/status").withTimeout(timeout).send();
		store.dispatch(statusUpdate(status));
		store.dispatch(apiSuccess());
		return status;
	} catch (error) {
		store.dispatch(apiTimeout());
		throw error;
	}
}

// ────────────────────────────────────────────────────────────────────────────────
// This method replaces the entire tasklist with the one from the server
// ────────────────────────────────────────────────────────────────────────────────
async function getTaskList() {
	const tasks = await get("api/tasks").send();
	console.log(tasks);
	store.dispatch(replaceTaskList(tasks));
	return tasks;
}

async function getTaskWithId(id: number) {
	const response = await post("api/task/get").body(JSON.stringify({ id })).send();

	const payload = createTask(response.payload);
	if (response.success && payload) {
		store.dispatch(updateTask(id, payload));
	}

	return response;
}

async function uploadTask(values: Task, path = "api/task/save") {
	const response = await post(path).json(values).send();
	const payload = createTask(response.payload);
	if (response.success && payload) {
		store.dispatch(updateTask(payload.id, payload));
		store.dispatch(selectTask(payload.id));
	}

	return response;
}

async function scheduleTask(id: number) {
	const response = await post("api/task/schedule").json({ id }).send();
	const payload = createTask(response.payload);
	if (response.success && payload) {
		store.dispatch(updateTask(id, payload));
	}
	return response;
}

async function unscheduleTask(id: number) {
	const response = await post("api/task/unschedule").json({ id }).send();
	const payload = createTask(response.payload);
	if (response.success && payload) {
		store.dispatch(updateTask(id, payload));
	}

	return response;
}

async function createTaskWithName(name: string) {
	const response = await post("api/task/create").json({ name }).send();
	if (response.success) {
		const payload = createTask(response.payload)!;
		store.dispatch(insertTask(payload));
		return [response, payload];
	}

	return [response, null];
}

async function deleteTask(id: number) {
	const response = await post("api/task/delete").json({ id }).send();
	if (response.success) {
		const tasks = store.getState().tasks;
		const taskList = Object.values(tasks)
			.map(t => t as Task)
			.filter(t => t.id !== id);
		store.dispatch(replaceTaskList(taskList));
	}

	return response;
}

export default {
	get,
	post,

	// APIs that modifies redux store upon success
	store: {
		getStatus,
		getTaskList,
		getTaskWithId,
		uploadTask,
		scheduleTask,
		unscheduleTask,
		createTaskWithName,
		deleteTask,
	},
};