import { Fragment, h } from "preact";
import { useSelector } from "react-redux"; 



function StateNode(props) {
	const { name, color } = props;

	return (
		<button 
			className={classNames("state-node")}
			style={`color: ${color}`}
			disabled={color === null}>
			{props.position}
			<div className="state-label">{name}</div>
		</button>
	);
}

const nodeColors = ["#173F5F", "#20639B", "#3CAEA3", "#ED553B"];

export function StateTimeline() {
	const states = useSelector(state => state.stateTimeline);
	const names = states.names;
	return (
		<div className="state-timeline"> 
			{names.map((name, i) => (
				<Fragment key={name}>
					<StateNode key={name} 
						name={name} 
						color={name === states.current ? nodeColors[i % names.length] : null}
						position={i}
					/>

					{i !== names.length - 1 && <hr />}
				</Fragment>
			))}
		</div>
	);
}