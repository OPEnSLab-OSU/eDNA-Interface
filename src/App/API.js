
import store from "./redux/store";
import { apiSuccess, apiTimeout, selectTask, updateStatus, updateTask, updateTaskList } from "./redux/actions";
import { base } from "./Static";
import { pick } from "Util";
const { dispatch } = store;

const convertArrayToObject = (array, key) => {
	return array.reduce((obj, item) => ({
		...obj,
		[item[key]]: item,
	}), {});
};

class APIBuilder {
	constructor(path, options) {
		this.path = path;
		this.options = options;
	}

	withTimeout(millis)  {
		this.controller = new AbortController();
		this.timeout = millis;
		this.options = { ...this.options, signal: this.controller.signal };
		return this;
	}

	body(payload) {
		this.options = { ...this.options, body: payload };
		return this;
	}

	json(payload) {
		return this.body(JSON.stringify(payload));
	}

	async send() {
		if (this.controller) {
			setTimeout(() => this.controller.abort(), this.timeout - 10);  
		}

		const response = await fetch(new URL(this.path, base), this.options);
		return response.json();
	}
}

const get = (path, options = {}) => new APIBuilder(path, { method: "GET", ...options });
const post = (path, options = {}) => new APIBuilder(path, { method: "POST", ...options });

async function getStatus(timeout) {
	try {
		const payload = await get("api/status").withTimeout(timeout).send();
		dispatch(updateStatus(payload));
		dispatch(apiSuccess());
	} catch (error) {
		dispatch(apiTimeout());
		throw error;
	} 
}

async function getTaskList() {
	const taskrefs = await get("api/tasks").send();
	const taskList = convertArrayToObject(taskrefs, "name");
	dispatch(updateTaskList(taskList)); // Replace the entire tasklist
}

async function getTaskWithName(name) {
	const task = await post("api/task/get").body(JSON.stringify({ name })).send();
	dispatch(updateTask(task));
}

async function uploadTask(values, path = "api/task/save") {
	const response = await post(path).json(values).send();
	if (response.success) {
		const updatedTask = response.payload;
		const { [values.name]: removed, ...taskList } = store.getState().tasks;
		taskList[updatedTask.name] = updatedTask;
		dispatch(updateTaskList(taskList));
		dispatch(selectTask(updatedTask.name));
	}

	return response;
}

async function uploadAndScheduleTask(values) {
	return await uploadTask(values, "api/task/schedule");
}

async function createTaskWithName(name) {
	const response = await post("api/task/create").body(JSON.stringify({ name })).send();
	if (response.success) {
		dispatch(updateTask(response.payload));
	}

	return response;
}

async function deleteTaskWithName(name) {
	const response = await post("api/task/delete").body(JSON.stringify({ name })).send();
	if (response.success) {
		const taskList = store.getState().tasks;
		delete taskList[name];
		dispatch(updateTaskList(taskList));
	}
}

export default {
	get,
	post,
	store: {
		getStatus, 
		getTaskList,
		getTaskWithName,
		uploadTask,
		uploadAndScheduleTask,
		createTaskWithName,
		deleteTaskWithName
	} 
};