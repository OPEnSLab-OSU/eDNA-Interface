const _ = {
	SENSOR_BARO: "barometric",
	SENSOR_DEPTH: "waterDepth",
	SENSOR_FLOW: "waterFlow",
	SENSOR_PRESSURE: "pressure",
	SENSOR_TEMP: "temperature",
	SENSOR_VOLUME: "waterVolume",
	STATE_CURRENT_NAME: "stateCurrentName",
	STATE_ID: "stateId",
	STATE_INDEX: "stateIndex",
	STATE_NAME: "stateName",
	TASK_CURRENT_NAME: "taskCurrentName",
	TASK_NAME: "name",
	TASK_NOTES: "notes",
	TASK_SCHEDULE: "schedule",
	TASK_STATUS: "status",
	TASK_TIME_BETWEEN: "timeBetween",
	TASK_VALVES: "valves",
	TIME_UTC: "timeUTC",
	VALVE_CURRENT: "valveCurrent",
	VALVE_DRY_TIME: "valveDryTime",
	VALVE_FLUSH_TIME: "valveFlushTime",
	VALVE_FLUSH_VOLUME: "valveFlushVolume",
	VALVE_GROUP: "valveGroup",
	VALVE_ID: "valveId",
	VALVE_PRESERVE_TIME: "valvePreserveTime",
	VALVE_SAMPLE_PRESSURE: "valveSamplePressure",
	VALVE_SAMPLE_TIME: "valveSampleTime",
	VALVE_SAMPLE_VOLUME: "valveSampleVolume",
	VALVE_SCHEDULE: "valveSchedule",
	VALVE_STATUS: "valveStatus",
	VALVES: "valves",
	VALVES_COUNT: "valvesCount"
};



function Valve(data = {}) {
	return { 
		id: data[_.VALVE_ID],
		group: data[_.VALVE_GROUP],
		status: data[_.VALVE_STATUS],
		schedule: data[_.VALVE_SCHEDULE],
		flushTime: data[_.VALVE_FLUSH_TIME],
		flushVolume: data[_.VALVE_FLUSH_VOLUME],
		sampleTime: data[_.VALVE_SAMPLE_TIME],
		samplePressure: data[_.VALVE_SAMPLE_PRESSURE],
		sampleVolume: data[_.VALVE_SAMPLE_VOLUME],
		dryTime: data[_.VALVE_DRY_TIME], 
		preserveTime: data[_.VALVE_PRESERVE_TIME],
	};
}

function Task(data = {}) {
	return {
		name: data[_.TASK_NAME],
		status: data[_.TASK_STATUS],
		scheduleDate: data[_.TASK_SCHEDULE],
		scheduleTime: data[_.TASK_SCHEDULE],
		valves: data[_.TASK_VALVES] ?? [],
		timeBetween: data[_.TASK_TIME_BETWEEN],
		notes: data[_.TASK_NOTES]
	};
}

function Status(data = {}) {
	return {
		currentState: data[_.STATE_CURRENT_NAME],
		valves: data[_.VALVES],
		time: data[_.TIME_UTC],
		pressure: data[_.SENSOR_PRESSURE],
		temperature: data[_.SENSOR_TEMP],
		barometric: data[_.SENSOR_BARO],
		waterVolume: data[_.SENSOR_VOLUME],
		waterFlow: data[_.SENSOR_FLOW],
		waterDepth: data[_.SENSOR_DEPTH]
	};
}

export default { keys: _, Valve, Task, Status };

