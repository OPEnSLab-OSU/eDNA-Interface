
import * as yup from "yup";


//
// ──────────────────────────────────────────────── I ──────────
//   :::::: K E Y S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────
//


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
	VALVES_COUNT: "valvesCount",
	TASK_NAME: "name",
	TASK_STATUS: "status",
	TASK_SCHEDULE: "schedule",
	TASK_VALVES: "valves",
	TASK_TIME_BETWEEN: "timeBetween",
	TASK_NOTES: "notes"
};


//
// ──────────────────────────────────────────────── II ──────────
//   :::::: T A S K : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────
//


const TaskSchema = yup.object({
	name: yup.string()
		.trim()
		.required(),
	
	// status represents the operational status of the task
	status: yup.number()
		.required()
		.min(0)
		.default(0),

	schedule: yup.number()
		.required()
		.default(0),
	
	date: yup.string()
		.ensure()
		.when(["schedule"], (schedule, schema) => {
			const date = new Date(schedule * 1000);
			const components = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
			const value = components.map(c => c.toString().padStart(2, "0")).join("-");
			return schema.default(value);
		}),

	time: yup.string()
		.ensure()
		.when(["schedule"], (schedule, schema) => {
			const date = new Date(schedule * 1000);
			const components = [date.getHours(), date.getMinutes()];
			const value = components.map(c => c.toString().padStart(2, "0")).join(":");
			return schema.default(value);
		}),

	valves: yup.array(yup.number())
		.ensure(),

	timeBetween: yup.number()
		.default(0),

	hour: yup.number()
		.min(0)
		.when("timeBetween", (timeBetween, schema) => {
			return schema.default(Math.trunc(timeBetween % 86400 / 3600));
		}),

	minute: yup.number()
		.min(0)
		.when("timeBetween", (timeBetween, schema) => {
			return schema.default(Math.trunc(timeBetween % 3600 / 60));
		}),
	
	second: yup.number()
		.min(0)
		.when("timeBetween", (timeBetween, schema) => {
			return schema.default(Math.trunc(timeBetween % 60));
		}),
	
	notes: yup.string()
		.nullable()
})
	// Aliases
	.from(_.TASK_SCHEDULE, "schedule")
	.from(_.TASK_TIME_BETWEEN, "timeBetween");



//
// ────────────────────────────────────────────────── III ──────────
//   :::::: V A V L E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//

	
const ValveSchema = yup.object({
	id: yup.number()
		.min(0)
		.default(0),

	task: yup.string()
		.default(undefined),

	status: yup.number()
		.positive()
		.default(0),

	flushTime: yup.number()
		.positive()
		.default(0),

	flushVolume: yup.number()
		.positive()
		.default(0),

	sampleTime: yup.number()
		.positive()
		.default(0),

	samplePressure: yup.number()
		.min(0)
		.default(0),

	sampleVolume: yup.number()
		.min(0)
		.default(0),

	dryTime: yup.number()
		.min(0)
		.default(0),

	preserveTime: yup.number()
		.min(0)
		.default(0)
})
	.from(_.VALVE_STATUS, "status")
	.from(_.VALVE_GROUP, "task");



//
// ──────────────────────────────────────────────────── IV ──────────
//   :::::: S T A T U S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//

	
const StatusSchema = yup.object({
	currentState: yup.string()
		.trim()
		.nullable()
		.required(),
	
	valves: yup.array(yup.number().min(0))
		.ensure()
		.required(),
	
	time: yup.number()
		.min(0)
		.default(undefined),
	
	pressure: yup.number()
		.default(undefined),
	
	temperature: yup.number()
		.default(undefined),
	
	barometric: yup.number()
		.default(undefined),
	
	waterVolume: yup.number()
		.default(undefined),

	waterFlow: yup.number()
		.default(undefined),

	waterDepth: yup.number()
		.default(undefined)
});

export default {
	keys: _,
	Valve: ValveSchema, 
	Task: TaskSchema,
	Status: StatusSchema
};

