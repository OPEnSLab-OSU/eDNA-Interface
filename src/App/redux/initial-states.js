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

const initialTasks = {};

export { 
	initialPanelVisibility,
	initialStateTimelineData,
	initialTasks,
	initialValveData,
};