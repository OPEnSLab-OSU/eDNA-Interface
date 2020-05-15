
import store from "./redux/store";
import { apiSuccess, apiTimeout, selectTask, updateStatus, updateTask, updateTaskList } from "./redux/actions";
import { base } from "./Static";


const { dispatch } = store;

function objectToQueryString(obj) {
	return Object.keys(obj).map(key => key + "=" + obj[key]).join("&");
}

const arrayToObject = (array, key) => {
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

	query(params) {
		this.path += "?" + objectToQueryString(params);
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
		const status = await get("api/status").withTimeout(timeout).send();
		dispatch(updateStatus(status));
		dispatch(apiSuccess());
		return status;
	} catch (error) {
		dispatch(apiTimeout());
		throw error;
	} 
}

async function getTaskList() {
	const tasks = await get("api/tasks").send();
	const taskList = arrayToObject(tasks, "name");
	dispatch(updateTaskList(taskList)); // Replace the entire tasklist
	return tasks;
}

async function getTaskWithName(name) {
	const response = await post("api/task/get").body(JSON.stringify({ name })).send();
	if (response.success) {
		dispatch(updateTask(response.payload));
	}
	
	return response;
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

async function scheduleTask(name) {
	return await post("api/task/schedule").json({ name }).send();
}

async function createTaskWithName(name) {
	const response = await post("api/task/create").json({ name }).send();
	if (response.success) {
		dispatch(updateTask(response.payload));
	}

	return response;
}

async function deleteTaskWithName(name) {
	const response = await post("api/task/delete").json({ name }).send();
	if (response.success) {
		const taskList = store.getState().tasks;
		delete taskList[name];
		dispatch(updateTaskList(taskList));
	}

	return response;
}

export default {
	get,
	post,

	// APIs that modifies Store upon success 
	store: {
		getStatus, 
		getTaskList,
		getTaskWithName,
		uploadTask,
		scheduleTask,
		createTaskWithName,
		deleteTaskWithName
	} 
};