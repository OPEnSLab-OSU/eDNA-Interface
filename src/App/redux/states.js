const initialPanelVisibility = {
	status: true, 
	task: true
};

const initialStateTimelineData = { 
	names: ["stop", "flush", "sample", "clean", "preserve"],
	current: "stop" 
};


const dummyValveData = Array(24).fill(0).map((_, idx) => ({ 
	id: idx, 
	status: "free" 
}));

const initialValveInfo = {
	current: 0,
	all: dummyValveData,
	selected: []
};

const initialStateConfigs = {
	flush: {
		name: "Flush",
		configs: [{ 
			"name": "duration",
			"description": "Controls how long before transitioning to the sample state" 
		}, {
			"name": "volume",
			"description": "Controls how much water will be taken" 
		}] 
	},
	sample: {
		name: "Sample",
		configs: [{ 
			"name": "duration",
			"description": "Controls how long before transitioning to the clean state" 
		}, {
			"name": "volume",
			"description": "Controls how much water will be taken" 
		}, {
			"name": "pressure",
			"description": "Controls how much water will be taken" 
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
			"description": "Controls how long before transitioning to the clean state" 
		}] 
	},
	values: { flushDuration: 0, flushVolume: 0 }
};

const initialStatus = [{
	name: "State",
	properties: [
		{ name: "current", value: null }
	]
}, {
	name: "Valve",
	properties: [
		{ name: "current", value: null	}, 
		{ name: "total", value: null }
	]
}, {
	name: "Sensor Data",
	properties: [
		{ name: "pressure", value: null },
		{ name: "temperature", value: null },
		{ name: "flow speed", value: null },
		{ name: "Almospheric", value: null }
	]
}, {
	name: "Clock",
	properties: [
		{ name: "Local Date", value: null },
		{ name: "Local Time", value: null }
	]
}];


export { 
	initialPanelVisibility,
	initialStateTimelineData,
	initialValveInfo,
	initialStateConfigs, 
	initialStatus
};