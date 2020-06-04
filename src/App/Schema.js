
import * as yup from "yup";
import { array, number, object, string } from "yup";


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

// ────────────────────────────────────────────────────────────────────────────────
// This schema is only used to ensure data integrity from JSON API and should be
// for validation purpose.
// ────────────────────────────────────────────────────────────────────────────────
const BaseTaskSchema = object({
	name: string()
		.trim()
		.required(),
	
	status: number()
		.required()
		.min(0),

	schedule: number()
		.required(),

	valves: array(number())
		.ensure(),

	timeBetween: number()
		.required()
		.default(0),

	notes: string()
		.nullable(),

	flushTime: number()
		.positive()
		.default(0),

	flushVolume: number()
		.positive()
		.default(0),

	sampleTime: number()
		.positive()
		.default(0),

	samplePressure: number()
		.min(0)
		.default(0),

	sampleVolume: number()
		.min(0)
		.default(0),

	dryTime: number()
		.min(0)
		.default(0),

	preserveTime: number()
		.min(0)
		.default(0)
})	
	// Aliases
	.from(_.TASK_SCHEDULE, "schedule")
	.from(_.TASK_TIME_BETWEEN, "timeBetween");


const TaskSchema = object({
	name: string()
		.trim()
		.required(),
	
	// status represents the operational status of the task
	status: number()
		.required()
		.min(0)
		.default(0),

	schedule: number()
		.required()
		.default(0),
	
	date: string()
		.ensure()
		.when(["schedule"], (schedule, schema) => {
			const date = new Date(schedule * 1000);
			const components = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
			const value = components.map(c => c.toString().padStart(2, "0")).join("-");
			return schema.default(value);
		}),

	time: string()
		.ensure()
		.when(["schedule"], (schedule, schema) => {
			const date = new Date(schedule * 1000);
			const components = [date.getHours(), date.getMinutes()];
			const value = components.map(c => c.toString().padStart(2, "0")).join(":");
			return schema.default(value);
		}),

	valves: array(number())
		.ensure(),

	timeBetween: number()
		.default(0),

	hour: number()
		.min(0)
		.when("timeBetween", (timeBetween, schema) => {
			return schema.default(Math.trunc(timeBetween % 86400 / 3600));
		}),

	minute: number()
		.min(0)
		.when("timeBetween", (timeBetween, schema) => {
			return schema.default(Math.trunc(timeBetween % 3600 / 60));
		}),
	
	second: number()
		.min(0)
		.when("timeBetween", (timeBetween, schema) => {
			return schema.default(Math.trunc(timeBetween % 60));
		}),
	
	notes: string()
		.nullable(),
	
})
	// Aliases
	.from(_.TASK_SCHEDULE, "schedule")
	.from(_.TASK_TIME_BETWEEN, "timeBetween");


//
// ──────────────────────────────────────────────────── IV ──────────
//   :::::: S T A T U S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//

	
const StatusSchema = object({
	currentState: string()
		.trim()
		.nullable()
		.required(),
	
	valves: array(number().min(0))
		.ensure()
		.required(),
	
	time: number()
		.min(0)
		.default(null),
	
	pressure: number()
		.default(null),
	
	temperature: number()
		.default(null),
	
	barometric: number()
		.default(null),
	
	waterVolume: number()
		.default(null),

	waterFlow: number()
		.default(null),

	waterDepth: number()
		.default(null)
});

export default {
	keys: _,
	Task: TaskSchema,
	Status: StatusSchema
};

