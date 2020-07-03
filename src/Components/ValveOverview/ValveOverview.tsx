import { h, FunctionComponent } from "preact";
import { useDispatch, useSelector } from "react-redux";
import { toggleTaskValve } from "App/redux/actions";
import { Valve } from "App/redux/models";
import { RootState } from "App/redux/store";
import { partition } from "Util";

import cn from "classnames";
import { Dictionary } from "@reduxjs/toolkit";

type ValveNodeProps = {
	onClick(event: MouseEvent): void;
	id: number;
	status: string;
	current?: boolean;
	queue?: number;
};

const ValveNode: FunctionComponent<ValveNodeProps> = ({
	onClick,
	id,
	status,
	queue,
	current,
}) => {
	return (
		<button
			type="button"
			className={cn("valve-node", { current })}
			onClick={onClick}
			disabled={status === "sampled"}>
			{id}
			{queue != undefined ? <div className="badge">{queue + 1}</div> : null}
		</button>
	);
};

function ValveOverview() {
	const valves = useSelector((state: RootState) => state.valves);
	const tasks = useSelector((state: RootState) => state.tasks);
	const selectedTaskId = useSelector((state: RootState) => state.selectedTask);
	const selectedTask = tasks[selectedTaskId];

	const { length } = valves.all;
	const [top, bottom] = partition(valves.all, (v) => v.id < length / 2);

	const valveToQueue = new Map<number, number>();
	selectedTask?.valves.forEach((v, i) => valveToQueue.set(v, i));

	const valveToCurrent = new Map<number, boolean>();
	selectedTask?.valves.forEach((v) =>
		valveToCurrent.set(v, valves.all[v].status == "free")
	);

	const toggle = (id: number) => {
		console.log(id);
	};

	const valveToValveNode = (v: Valve) => (
		<ValveNode
			key={v.id}
			id={v.id}
			onClick={() => toggle(v.id)}
			status={v.status}
			queue={valveToQueue.get(v.id)}
			current={valveToCurrent.get(v.id)}
		/>
	);

	return (
		<div className="valve-overview">
			{top.map(valveToValveNode)}
			{bottom.reverse().map(valveToValveNode)}
		</div>
	);
}

export { ValveOverview };
