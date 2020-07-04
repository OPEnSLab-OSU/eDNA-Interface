import * as yup from "yup";
import { array, boolean, number, object, string } from "yup";

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
const StateField = number().min(0).required().default(0);
// prettier-ignore
export const TaskSchema = object({
	id: number()
		.min(1)
		.required()
		.truncate()
		.default(Math.floor(Math.random() * (2**32 - 1) + 1)) ,
	name: string()
		.trim()
		.required(),
	createdAt: number()
		.integer()
		.required()
		.default(0),
	status: number()
		.min(0)
		.integer()
		.required()
		.default(0),
	schedule: number()
		.min(0)
		.integer()
		.required()
		.default(0),
	valves: array(number().defined())
		.ensure()
		.defined(),
	timeBetween: number()
		.min(0)
		.required()
		.default(5),
	notes: string(),
	flushTime: StateField,
	flushVolume: StateField,
	sampleTime: StateField,
	samplePressure: StateField,
	sampleVolume: StateField,
	dryTime: StateField,
	preserveTime: StateField
}).defined();

export type Task = yup.InferType<typeof TaskSchema>;
export type RequiredTaskProperties = "name";
export type OptionalTask = Partial<Omit<Task, RequiredTaskProperties>>;
export type RequiredTask = Required<Pick<Task, RequiredTaskProperties>>;
export interface DefaultTask extends OptionalTask, RequiredTask {}

// ────────────────────────────────────────────────────────────────────────────────
// Here we are extending the a valid task object with two computed extra properties:
// date and time. Otherwise returns undefined.
// ────────────────────────────────────────────────────────────────────────────────

export const verifyTaskFromAPI = async (
	raw: DefaultTask,
	options: yup.ValidateOptions = { strict: true }
): Promise<Task> => {
	return TaskSchema.validate(raw, options);
};

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
export type Status = {
	currentState?: string;
	valves: number[];
	utc?: number;
	pressure?: number;
	temperature?: number;
	barometric?: number;
	waterVolume?: number;
	waterFlow?: number;
	waterDepth?: number;
};

//
// ────────────────────────────────────────────────── V ──────────
//   :::::: V A L V E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//

export type Valve = {
	id: number;
	status: string;
	isSelected?: boolean;
};
