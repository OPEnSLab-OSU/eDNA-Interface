import Schema from "App/Schema";

const initialPanelVisibility = {
	status: true, 
	task: true
};

const initialStateTimelineData = { 
	names: ["stop", "flush", "sample", "clean", "preserve"],
	current: "stop" 
};


const initialValveData = {
	all: Array(24).fill(0).map((_, id) => ({ id, status: "sampled" })),
	current: -1,
	selected: []
};

let task_array = ["Task 1", "Task 2", "Task 3"].map(t => Schema.Task.cast({ [Schema.keys.TASK_NAME]: t }));
task_array = [];

const initialTasks = {
	all: task_array,
	selected: null
};

const initialStateConfigs = {
	flush: {
		name: "Flush",
		configs: [{ 
			"name": "duration",
			"description": "Controls how long before transitioning to the sample state" 
		}, {
			"name": "volume",
			"description": "Controls how much water will be used to flush the system" 
		}] 
	},
	sample: {
		name: "Sample",
		configs: [{ 
			"name": "duration",
			"description": "Controls how long before transitioning to the clean state" 
		}, {
			"name": "volume",
			"description": "Controls how much water will be sampled" 
		}, {
			"name": "pressure",
			"description": "Controls when to automatically stop when the pressure exeeds the given limit" 
		}] 
	},
	clean: {
		name: "Clean",
		configs: [{ 
			"name": "duration",
			"description": "Controls how long before transitioning to the clean state" 
		}] 
	},

	preserve: {
		name: "Preserve",
		configs: [{ 
			"name": "duration",
			"description": "Controls how long before transitioning to the stop state" 
		}] 
	},
	values: { flushDuration: 0, flushVolume: 0 }
};


export { 
	initialPanelVisibility,
	initialStateTimelineData,
	initialTasks,
	initialValveData,
	initialStateConfigs, 
};