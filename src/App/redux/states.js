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
	flush: [{ 
		"name": "duration",
		"description": "Controls how long before transitioning to the sample state" 
	}, {
		"name": "volume",
		"description": "Controls how much water will be taken" 
	}],
	sample: {}
};


export { 
	initialPanelVisibility,
	initialStateTimelineData,
	initialValveInfo,
	initialStateConfigs 
};