import { h } from "preact";
import { useSelector } from "react-redux";
import { RootState } from "App/redux/store";
import { StateUpdater } from "preact/hooks";
import cn from "classnames";

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

type PickAndFlatten<T, K extends keyof T> = UnionToIntersection<T[K]>;
type StatusItemData = {
	name: string;
	properties: { name: string; value: any }[];
};

function makeStatusItemData(
	status: PickAndFlatten<RootState, "status">
): StatusItemData[] {
	const {
		currentState,
		valves,
		pressure,
		temperature,
		barometric,
		waterVolume,
		waterFlow,
		waterDepth,
		utc,
	} = status;

	const currentValve = valves?.findIndex((v) => v === 2);
	const valveCount = valves?.length;
	const date = utc ? new Date(Number(utc * 1000)) : null;

	return [
		{
			name: "State",
			properties: [
				{ name: "current", value: String(currentState).toUpperCase() },
			],
		},
		{
			name: "Valve",
			properties: [
				{ name: "current", value: currentValve },
				{ name: "total", value: valveCount },
			],
		},
		{
			name: "Sensor Data",
			properties: [
				{ name: "pressure", value: pressure },
				{ name: "temperature", value: temperature },
				{ name: "barometric", value: barometric },
				{ name: "flow speed", value: waterFlow },
				{ name: "volume", value: waterVolume },
				{ name: "depth", value: waterDepth },
			],
		},
		{
			name: "Clock",
			properties: [
				{ name: "Local Date", value: date?.toLocaleDateString() },
				{ name: "Local Time", value: date?.toLocaleTimeString() },
			],
		},
	];
}

const StatusItem = (props: StatusItemData) => {
	const { name, properties } = props;
	return (
		<li className="item">
			<div className="title">{name}</div>
			{properties.map((property) => (
				<div key={property.name} className="property">
					<i className="name">{property.name}</i>
					<i className="value">{property.value ?? "------"}</i>
				</div>
			))}
		</li>
	);
};

export const Status = (props: {
	connection: { statusText: string; attempts: number };
	setStatusUpdating: StateUpdater<boolean>;
}) => {
	const panels = useSelector((state: RootState) => state.panels);
	const status = useSelector((state: RootState) => state.status);
	const statusItemData = makeStatusItemData(status);

	const { connection, setStatusUpdating } = props;
	const statusText =
		connection.statusText === "timeout"
			? `timeout (${connection.attempts})`
			: connection.statusText;

	return (
		<div className={cn("status", { expanded: panels.status })}>
			<ul className="items">
				<li className={cn("item", "button", { active: panels.status })}>
					<span>
						<i>E</i>DNA
					</span>
				</li>

				{statusItemData.map((data) => (
					<StatusItem key={data.name} {...data} />
				))}

				<li className={cn("item", "connection")}>
					<button type="button" onClick={() => setStatusUpdating(true)}>
						<i className={cn("dot", statusText)} />
						<i>{statusText}</i>
					</button>
				</li>
			</ul>
		</div>
	);
};
