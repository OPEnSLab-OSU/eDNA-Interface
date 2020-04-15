import { Fragment, h } from "preact";
import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import { AppContext } from "App";
import { Formik, useField, useFormik, useFormikContext } from "formik";
import { BasicTextField } from "Components/TextField";

import { useDispatch, useSelector } from "react-redux";


import { actions } from "App/redux/actions";
import { toggleValveSelection } from "../../App/redux/actions";


function ValveNode(props) {
	const { id, status } = props;
	const [selected, setSelected] = useState(false);
	const dispatch = useDispatch();
	const valves = useSelector(state => state.valves);
	const valvesSelected = valves.selected;
	const queue = valvesSelected.findIndex(valveId => valveId === id);

	const toggle = () => {
		dispatch(toggleValveSelection(id));
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
export function ValveOverview() {
	const valves = useSelector(state => state.valves);
	const midPoint = valves.all.length;
	const top = valves.all.filter(v => v.id < midPoint);
	const bottom = valves.all.filter(v => v.id >= midPoint);

	return (
		<div className="valve-overview">
			{top.map(v => <ValveNode key={v.id} {...v}/>)}
			{bottom.reverse().map(v => <ValveNode key={v.id} {...v}/>)}
		</div>
	);
}