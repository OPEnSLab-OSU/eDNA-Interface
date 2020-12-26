import classNames from "classnames";
import { Fragment, h } from "preact";
import { useSelector } from "react-redux";

import { RootState } from "App/redux/store";

type IStateNodeProps = { name: string; color: string | null; position: number };
function StateNode({ name, color, position }: IStateNodeProps) {
	return (
		<button
			type="button"
			className={classNames("state-node")}
			style={`color: ${color}`}
			disabled={color === null}>
			{position}
			<div className="state-label">{name}</div>
		</button>
	);
}

const stateNames = ["idle", "stop", "flush", "sample", "dry", "preserve"];
const nodeColors = ["#173F5F", "#20639B", "#3CAEA3", "#ED553B"];

export function StateTimeline() {
	const status = useSelector((state: RootState) => state.status);
	return (
		<div className="state-timeline">
			{stateNames.map((name, i) => (
				<Fragment key={name}>
					<StateNode
						key={name}
						name={name}
						color={
							name === status.currentState?.split("-")[0].toLowerCase()
								? nodeColors[i % stateNames.length]
								: null
						}
						position={i}
					/>

					{i !== stateNames.length - 1 && <hr />}
				</Fragment>
			))}
		</div>
	);
}
