import { h } from "preact";
import { useSelector } from "react-redux"; 

function statusItemsFrom(status) {
	const {
		stateCurrentName,
		valves = [], 
		pressure,
		temperature,
		barometric,
		waterVolume,
		waterFlow,
		waterDepth,
		utc
	} = status; 

	const currentValve = valves.findIndex(v => parseInt(v) === 2);
	const valveCount = valves.length;
	const date = new Date(Number(utc * 1000));

	return [{
		name: "State",
		properties: [
			{ name: "current", value: String(stateCurrentName).toUpperCase() }
		]
	}, {
		name: "Valve",
		properties: [
			{ name: "current", value: currentValve }, 
			{ name: "total", value: valveCount }
		]
	}, {
		name: "Sensor Data",
		properties: [
			{ name: "pressure", value: pressure },
			{ name: "temperature", value: temperature },
			{ name: "barometric", value: barometric },
			{ name: "flow speed", value: waterFlow },
			{ name: "volume", value: waterVolume },
			{ name: "depth", value: waterDepth }
		]
	}, {
		name: "Clock",
		properties: [
			{ name: "Local Date", value: date.toLocaleDateString() },
			{ name: "Local Time", value: date.toLocaleTimeString() }
		]
	}];
}

function StatusItem(props) {
	const { name, properties } = props;
	return (
		<li className="item">
			<div className="title">{name}</div>
			{properties.map((property, i) => (
				<div key={i} className="property">
					<i className="name">{property.name}</i>
					<i className="value">{property.value ?? "------"}</i>
				</div>
			))}
		</li>
	);
}

export function Status(props) {
	const panels = useSelector(state => state.panels);
	const status = useSelector(state => state.status);
	const statusItems = statusItemsFrom(status);

	const { connection, setStatusUpdating } = props;
	const statusText = (function() {
		if (connection.statusText === "timeout") {
			return `timeout (${connection.attempts})`;
		} else {
			return connection.statusText;
		}
	})();

	return (
		<div className={classNames("status", { "expanded": panels.status })}>
			<ul className="items">
				<li className={classNames("item", "button", { "active": panels.status })} 
					onClick={() => {}}>
					<span><i>E</i>DNA</span>
				</li>

				{statusItems.map((item, i) => (<StatusItem key={i} {...item} />))}

				<li className={classNames("item", "connection")}>
					<button onClick={() => setStatusUpdating(true)}>
						<i className={classNames("dot", statusText)}></i>
						<i>{statusText}</i>
					</button>
				</li>
			</ul>
		</div>
	);
}