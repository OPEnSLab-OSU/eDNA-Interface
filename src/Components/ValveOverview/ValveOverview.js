import { h } from "preact";
import { useState } from "preact/hooks";
import { useDispatch, useSelector } from "react-redux";
import { toggleTaskValve } from "App/redux/actions";


function ValveNode(props) {
	const { id, status } = props;
	const [selected, setSelected] = useState(false);
	const dispatch = useDispatch();

	const tasks = useSelector(state => state.tasks);
	const taskname = useSelector(state => state.selectedTask);
	const task = tasks[taskname];

	const queue = task.valves.findIndex(valveId => valveId === id);

	const toggle = () => {
		if (task.status == 1){
			return;
		}

		dispatch(toggleTaskValve(taskname, id));
		setSelected(!selected);
	};
	
	return (
		<button 
			className={classNames("valve-node", { "selected": selected })} 
			onClick={toggle}
			disabled={status === "sampled"}>
			{id}
			{queue > -1 ? <div className="badge">{queue + 1}</div> : null}
		</button>
	);
}

function ValveOverview() {
	const valves = useSelector(state => state.valves);
	const midPoint = valves.all.length;
	const top = valves.all.filter(v => v.id < midPoint);
	const bottom = valves.all.filter(v => v.id >= midPoint);

	const tasks = useSelector(state => state.tasks);
	const taskname = useSelector(state => state.selectedTask);
	const task = tasks[taskname];

	if (!task)   {
		return null;
	}

	return (
		<div className="valve-overview">
			{top.map(v => <ValveNode key={v.id} {...v}/>)}
			{bottom.reverse().map(v => <ValveNode key={v.id} {...v}/>)}
		</div>
	);
}

export { ValveOverview };