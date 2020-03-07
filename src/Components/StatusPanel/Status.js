import { h } from "preact";
import { useContext, useState } from "preact/hooks";
import { useSelector } from "react-redux"; 



function StatusItem(props) {
	const { name, properties } = props;
	return (
		<div className="item">
			<div className="title">{name}</div>
			{properties.map((p, i) => (
				<div key={i} className="property">
					<i className="name">{p.name}</i>
					<i className="value">{p.value ?? "------"}</i>
				</div>
			))}
		</div>
	);
}
export function Status(props) {
	const panels = useSelector(state => state.panels);
	const statusItems = useSelector(state => state.status);
	return (
		<div className={classNames("status", { "expanded": panels.status })}>
			<ul className="items">
				<li className={classNames("item", "button", { "active": panels.status })} 
					onClick={() => {}}>
					<a className={classNames("active")}>
						<i>E</i>DNA
					</a>
				</li>

				{statusItems.map((status, i) => (
					<li key={i}>
						<StatusItem {...status} />
					</li>
				))}

				<li className={classNames("item", "button")}>
					<a className={classNames("active")}>
						Connection: {props.connectionStatus}
					</a>
				</li>
			</ul>
		</div>
	);
}