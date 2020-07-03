import * as yup from "yup";
import { array, number, object, string, boolean } from "yup";

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

// export function autoImplements<T>(): new () => T {
// 	return class {} as any;
// }

// Extends an object verified using a schema with another object
export function createWithMixins<T, K>(
	raw: T,
	schema: yup.Schema<T>,
	extras: (transformed: T) => K
): (T & K) | undefined {
	const transformed = schema.cast(raw);
	if (schema.validateSync(transformed)) {
		return { ...transformed, ...extras(transformed) };
	}
}

namespace Schemas {
	export const stateInput = number().min(0).notRequired().default(0);
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
// object but this should do for now.
// prettier-ignore
const BaseTaskSchema = object({
	id: number()
		.nullable(),
	name: string()
		.trim()
		.required(),
	createdAt: number()
		.integer()
		.default(0),
	status: number()
		.min(0)
		.required(),
	schedule: number()
		.integer()
		.required(),
	valves: array(number().defined())
		.ensure()
		.defined(),
	timeBetween: number()
		.default(0),
	notes: string(), 
	flushTime: Schemas.stateInput,
	flushVolume: Schemas.stateInput,
	sampleTime: Schemas.stateInput,
	samplePressure: Schemas.stateInput,
	sampleVolume: Schemas.stateInput,
	dryTime: Schemas.stateInput,
	preserveTime: Schemas.stateInput,
}).defined();

export type BaseTask = yup.InferType<typeof BaseTaskSchema>;

// NOTE: I would like to use get-accessors but I couldn't find a way to make it work
// with spread operator
export interface Task extends BaseTask {
	id: number;
	createdAt: number;
	getDate(): string;
	getTime(): string;
}

// ────────────────────────────────────────────────────────────────────────────────
// Here we are extending the a valid task object with two computed extra properties:
// date and time. Otherwise returns undefined.
// ────────────────────────────────────────────────────────────────────────────────
export function createTask(raw: BaseTask): Task | undefined {
	return createWithMixins(raw, BaseTaskSchema, (transformed) => ({
		id: transformed.id!,
		createdAt: transformed.createdAt!,
		getDate(): string {
			// Expect this.schedule to be a number
			const { schedule } = this as any;
			if (typeof schedule !== "number") {
				throw new Error("Schedule is not a number");
			}

			const date = new Date(schedule * 1000);
			const components = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
			return components.map((c) => c.toString().padStart(2, "0")).join("-");
		},

		getTime(): string {
			// Expect this.schedule to be a number
			const { schedule } = this as any;
			if (typeof schedule !== "number") {
				throw new Error("Schedule is not a number");
			}

			const date = new Date(schedule * 1000);
			const components = [date.getHours(), date.getMinutes()];
			return components.map((c) => c.toString().padStart(2, "0")).join(":");
		},
	}));
}

// ────────────────────────────────────────────────────────────────────────────────
// Example Usage
// ────────────────────────────────────────────────────────────────────────────────
/* const task: BaseTaskType = {
	name: "Task 1",
	status: 0,
	schedule: 200000000,
	valves: [],
	timeBetween: 0,
};

const a: TaskType = createTask(task)!;
console.log(a.name, a.date(), a.time(), a);

const b: TaskType = createTask({ ...a, id: null, schedule: 100000000 })!;
console.log(b.name, b.date(), b.time(), b); */

//
// ──────────────────────────────────────────────────── IV ──────────
//   :::::: S T A T U S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//
namespace Schemas {
	export const statusField = number().nullable().default(null);
}

// prettier-ignore
export const StatusSchema = object({
	currentState: string()
		.trim()
		.nullable(),
	valves: array(number().min(0).defined())
		.ensure(),
	utc: number()
		.min(0)
		.nullable(),
	pressure: Schemas.statusField,
	temperature: Schemas.statusField,
	barometric: Schemas.statusField,
	waterVolume: Schemas.statusField,
	waterFlow: Schemas.statusField,
	waterDepth: Schemas.statusField,
}).defined();

export type Status = yup.InferType<typeof StatusSchema>;

//
// ────────────────────────────────────────────────── V ──────────
//   :::::: V A L V E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//
export const ValveSchema = object({
	id: number().min(0).integer().required(),
	status: string().required(),
	isSelected: boolean(),
}).defined();

export type Valve = yup.InferType<typeof ValveSchema>;
