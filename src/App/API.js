
import store from "./redux/store";
import { base } from "./Static";
import {
	apiSuccess,
	apiTimeout, 
	selectTask, 
	updateStatus, 
	updateTask, 
	updateTaskList 
} from "./redux/actions";


//
// ────────────────────────────────────────────────────── I ──────────
//   :::::: H E L P E R S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────
//


function objectToQueryString(obj) {
	return Object.keys(obj).map(key => key + "=" + obj[key]).join("&");
}

// ────────────────────────────────────────────────────────────────────────────────
// The server sends tasklist as an array. This method convert array of objects to 
// a single level object using the given key as direct properties
// ────────────────────────────────────────────────────────────────────────────────
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

//
// ────────────────────────────────────────────── II ──────────
//   :::::: A P I : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────
//

const get  = (path, options = {}) => new APIBuilder(path, { method: "GET", ...options });
const post = (path, options = {}) => new APIBuilder(path, { method: "POST", ...options });

async function getStatus(timeout) {
	try {
		const status = await get("api/status").withTimeout(timeout).send();
		store.dispatch(updateStatus(status));
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
	const taskList = arrayToObject(tasks, "name");
	store.dispatch(updateTaskList(taskList)); 
	return tasks;
}

async function getTaskWithName(name) {
	const response = await post("api/task/get").body(JSON.stringify({ name })).send();
	if (response.success) {
		store.dispatch(updateTask(response.payload));
	}
	
	return response;
}

async function uploadTask(values, path = "api/task/save") {
	const response = await post(path).json(values).send();
	if (response.success) {
		const updatedTask = response.payload;
		const { [values.name]: removed, ...taskList } = store.getState().tasks;
		taskList[updatedTask.name] = updatedTask;
		store.dispatch(updateTaskList(taskList));
		store.dispatch(selectTask(updatedTask.name));
	}

	return response;
}

async function scheduleTask(name) {
	const response = await post("api/task/schedule").json({ name }).send();
	if (response.success) {
		store.dispatch(updateTask(response.payload));
	}
	return response;
}

async function unscheduleTask(name) {
	const response = post("api/task/unschedule").json({ name }).send();
	if (response.success) {
		store.dispatch(updateTask(response.payload));
	}

	return response;
}

async function createTaskWithName(name) {
	const response = await post("api/task/create").json({ name }).send();
	if (response.success) {
		store.dispatch(updateTask(response.payload));
	}

	return response;
}

async function deleteTaskWithName(name) {
	const response = await post("api/task/delete").json({ name }).send();
	if (response.success) {
		const taskList = store.getState().tasks;
		delete taskList[name];
		store.dispatch(updateTaskList(taskList));
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
		getTaskWithName,
		uploadTask,
		scheduleTask,
		unscheduleTask,
		createTaskWithName,
		deleteTaskWithName
	} 
};