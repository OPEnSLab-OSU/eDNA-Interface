export const stateConfigData = {
	flush: {
		name: "flush",
		properties: [
			{
				name: "duration",
				alias: "time",
				type: "number",
				description:
					"Controls how long before transitioning to the sample state",
			},
			{
				name: "volume",
				description:
					"Controls how much water will be used to flush the system",
			},
		],
	},
	sample: {
		name: "sample",
		properties: [
			{
				name: "duration",
				alias: "time",
				type: "number",
				description:
					"Controls how long before transitioning to the dry state",
			},
			{
				name: "volume",
				type: "number",
				description: "Controls how much water will be sampled",
			},
			{
				name: "pressure",
				type: "number",
				description:
					"Controls when to automatically stop when the pressure exeeds the given limit",
			},
		],
	},
	dry: {
		name: "dry",
		properties: [
			{
				name: "duration",
				alias: "time",
				type: "number",
				description:
					"Controls how long before transitioning to the preserve state",
			},
		],
	},
	preserve: {
		name: "preserve",
		properties: [
			{
				name: "duration",
				alias: "time",
				type: "number",
				description:
					"Controls how long before transitioning to the stop state",
			},
		],
	},
};
