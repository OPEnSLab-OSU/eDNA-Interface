import { h } from "preact";
import { useContext, useState } from "preact/hooks";
import { useSelector } from "react-redux"; 



function StateNode(props) {
	const { name, current, color } = props;
	return (
		<div className={classNames("state-node", "card", { current })}
			style={`color: ${color}`}
		>
			{name}
		</div>
	);
}

const nodeColors = ["#173F5F", "#20639B", "#3CAEA3", "#ED553B"];

export function StateTimeline() {
	const states = useSelector(state => state.states);
	const names = states.names;
	return (
		<div className="state-timeline"> 
			{names.map((name, i) => (
				<StateNode 
					key={name} name={name} 
					color={nodeColors[i % names.length]}
					current={name === states.current}
				/>
			))}
		</div>
	);
}