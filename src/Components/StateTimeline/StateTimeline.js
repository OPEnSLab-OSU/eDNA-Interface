import { h } from "preact";
import { useContext, useState } from "preact/hooks";
import { useSelector } from "react-redux"; 



function StateNode(props) {
	const { name, color } = props;
	return (
		<button 
			className={classNames("state-node", "card")}
			style={`color: ${color}`}
			disabled={color === null}>
			{name}
		</button>
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
					color={name === states.current ? nodeColors[i % names.length]: null}
				/>
			))}
		</div>
	);
}