import { objectToQueryString } from "Util";

import {
	apiSuccess,
	apiTimeout,
	insertTask,
	replaceTaskList,
	statusUpdate,
	updateTask,
} from "./redux/actions";
import { Status, Task, verifyTaskFromAPI } from "./redux/models";
import { store } from "./redux/store";
import { base } from "./Static";

//
// ────────────────────────────────────────────── II ──────────
//   :::::: A P I : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────
//

type DefaultAPIResponse = {
	success?: string;
	error?: string;
	payload?: any;
};

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
		this.path += `?${objectToQueryString(params)}`;
	}

	async send<T = DefaultAPIResponse>(): Promise<T> {
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
		const status = await get("api/status").withTimeout(timeout).send<Status>();
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
	const payload = await get("api/tasks").send<Task[]>();
	const options = { strict: true };
	const verifiedTasks = await Promise.all(
		payload.map((t) => verifyTaskFromAPI(t, options))
	);
	store.dispatch(replaceTaskList(verifiedTasks));
	return verifiedTasks;
}

async function getTaskWithId(
	id: number
): Promise<readonly [DefaultAPIResponse, Task | null]> {
	const response = await post("api/task/get").body(JSON.stringify({ id })).send();
	if (response.success) {
		const verified = await verifyTaskFromAPI(response.payload);
		store.dispatch(updateTask(id, verified));
		return [response, verified];
	}
	return [response, null];
}

async function uploadTask(
	task: Task,
	path = "api/task/save"
): Promise<DefaultAPIResponse> {
	const response = await post(path).json(task).send();
	if (response.success) {
		store.dispatch(updateTask(task.id, task));
		console.log(store.getState().tasks);
	}

	return response;
}

async function scheduleTask(
	id: number
): Promise<readonly [DefaultAPIResponse, Task | null]> {
	const response = await post("api/task/schedule").json({ id }).send();
	if (response.success) {
		const payload = await verifyTaskFromAPI(response.payload);
		store.dispatch(updateTask(id, payload));
		return [response, payload] as const;
	}

	return [response, null];
}

async function unscheduleTask(
	id: number
): Promise<readonly [DefaultAPIResponse, Task | null]> {
	const response = await post("api/task/unschedule").json({ id }).send();
	if (response.success) {
		const payload = await verifyTaskFromAPI(response.payload);
		store.dispatch(updateTask(id, payload));
		return [response, payload] as const;
	}

	return [response, null];
}

async function createTaskWithName(
	name: string
): Promise<readonly [DefaultAPIResponse, Task | null]> {
	const response = await post("api/task/create").json({ name }).send();
	if (response.success) {
		const payload = await verifyTaskFromAPI(response.payload);
		store.dispatch(insertTask(payload));
		return [response, payload] as const;
	}

	return [response, null];
}

async function deleteTask(id: number) {
	const response = await post("api/task/delete").json({ id }).send();
	if (response.success) {
		const { tasks } = store.getState();
		const taskList = Object.values(tasks)
			.map((t) => t as Task)
			.filter((t) => t.id !== id);
		store.dispatch(replaceTaskList(taskList));
	}

	return response;
}

export const API = {
	get,
	post,

	// APIs that directly modifies the redux store upon success
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
