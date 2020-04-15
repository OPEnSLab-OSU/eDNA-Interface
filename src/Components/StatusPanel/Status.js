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

import { useSelector } from "react-redux"; 

export function Status() {
	const panels = useSelector(state => state.panels);
	
	// const toggleStatusBar = () => {
	// 	setApp({ ...app, statusPanel: !app.statusPanel });
	// };

	return (
		<div className={classNames("status", { "expanded": panels.status })}>
			<ul className="items">
				<li className={classNames("item", "button", { "active": panels.status })} 
					onClick={() => {}}>
					<a className={classNames("active")}>
						Hold
					</a>
				</li>
				<li className={classNames("item", "button")}>
					<a className={classNames("active")}>
							-----
					</a>
				</li>
			</ul>
		</div>
	);
}