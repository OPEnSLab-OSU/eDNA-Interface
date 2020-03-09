import { h } from "preact";
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

				{statusItems.map((status, i) => (
					<li key={i}>
						<StatusItem {...status} />
					</li>
				))}

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