
import * as yup from "yup";
import { array, number, object, string } from "yup";


//
// ──────────────────────────────────────────────── I ──────────
//   :::::: K E Y S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────
//

export const KEYS = {
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
	TASK_NOTES: "notes",
};

//
// ────────────────────────────────────────────────────── II ──────────
//   :::::: H E L P E R S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────
//

export function autoImplements<T>(): new () => T {
	return class {} as any;
}


export function validateExtends<T, K>(data: object, schema: yup.Schema<T>, extras: (base: T) => K) : (T & K) | null {
	const verifiedData = schema.cast(data);
	if (verifiedData == null) {
		return null;
	}

	return Object.assign(verifiedData, extras(verifiedData));
}

namespace SchemaHelpers {
	export const numberParam = number()
		.positive()
		.notRequired()
		.default(0);
}

//
// ──────────────────────────────────────────────── III ─────────
//   :::::: T A S K : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────
//

// ────────────────────────────────────────────────────────────────────────────────
// This schema is used to ensure correct Task object shape between server and client
// ────────────────────────────────────────────────────────────────────────────────
// This is where we define the structure of our JSON payload. In a more robust env,
// one would send over a schema and use an editor plugin to strongly-type out the
// object.
export const BaseTaskSchema = object({
	name: string()
		.trim()
		.defined(),
	status: number()
		.defined()
		.min(0),
	schedule: number()
		.defined(),
	valves: array(number().defined())
		.ensure()
		.defined(),
	timeBetween: number()
		.default(0),
	notes: string(), 
	flushTime: SchemaHelpers.numberParam,
	flushVolume: SchemaHelpers.numberParam,
	sampleTime: SchemaHelpers.numberParam,
	samplePressure: SchemaHelpers.numberParam,
	sampleVolume: SchemaHelpers.numberParam,
	dryTime: SchemaHelpers.numberParam,
	preserveTime: SchemaHelpers.numberParam,
}).defined();


export type BaseTaskSchemaType = yup.InferType<typeof BaseTaskSchema>;
export type TaskType = BaseTaskSchemaType & {
	date: string,
	time: string
}

// ────────────────────────────────────────────────────────────────────────────────
// Here we are extending the a valid task object with two computed extra properties:
// date and time
// ────────────────────────────────────────────────────────────────────────────────
export function createTask(data: BaseTaskSchemaType) : TaskType | null {
	return validateExtends(data, BaseTaskSchema, (base) => ({
		get date() {
			const date = new Date(base.schedule * 1000);
			const components = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
			return components
				.map((c) => c.toString().padStart(2, "0"))
				.join("-");
		},

		get time() {
			const date = new Date(base.schedule * 1000);
			const components = [date.getHours(), date.getMinutes()];
			return components
				.map((c) => c.toString().padStart(2, "0"))
				.join(":");
		},
	})); 
}

// ────────────────────────────────────────────────────────────────────────────────
// Example Usage
// ────────────────────────────────────────────────────────────────────────────────
/* const task: BaseTaskSchemaType = {
	name: "Task 1",
	status: 0,
	schedule: Math.floor(Date.now() / 1000),
	valves: [],
	timeBetween: 0,
};

const cleanedTask = createTask(task);
console.log(cleanedTask); */

//
// ──────────────────────────────────────────────────── IV ──────────
//   :::::: S T A T U S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//

export const StatusSchema = object({
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
		.default(null),
});


