import { Dictionary } from "@reduxjs/toolkit";

export type StateConfigData = {
	name: string;
	properties: { name: string; alias?: string; type: string; description?: string }[];
};

export const stateConfigData: {
	flush: StateConfigData;
	sample: StateConfigData;
	dry: StateConfigData;
	preserve: StateConfigData;
} = {
	flush: {
		name: "flush",
		properties: [
			{
				name: "time",
				type: "number",
				description: "Time limit before moving to the next state",
			},
			{
				name: "volume",
				type: "number",
				description: "Amount of water to flush in ml",
			},
		],
	},
	sample: {
		name: "sample",
		properties: [
			{
				name: "time",
				type: "number",
				description: "Time limit before moving to the next state",
			},
			{
				name: "volume",
				type: "number",
				description: "Amount of water to sample in ml",
			},
			{
				name: "pressure",
				type: "number",
				description: "Max pressure before moving to the next state",
			},
		],
	},
	dry: {
		name: "dry",
		properties: [
			{
				name: "time",
				type: "number",
				description: "Time limit before moving to the next state",
			},
		],
	},
	preserve: {
		name: "preserve",
		properties: [
			{
				name: "time",
				type: "number",
				description: "Time limit before moving to the next state",
			},
		],
	},
};
