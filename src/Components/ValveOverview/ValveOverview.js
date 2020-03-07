import { Fragment, h } from "preact";
import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import { AppContext } from "App";
import { Formik, useField, useFormik, useFormikContext } from "formik";
import { BasicTextField } from "Components/TextField";

import { useDispatch, useSelector } from "react-redux";


import { actions } from "App/redux/actions";
import { toggleValveSelection } from "../../App/redux/actions";


function ValveNode(props) {
	const { id } = props;
	const [selected, setSelected] = useState(false);
	const dispatch = useDispatch();
	const valvesSelected = useSelector(state => state.valves.selected);
	const order = valvesSelected.findIndex(valveId => valveId === id);

	const toggle = () => {
		dispatch(toggleValveSelection(id));
		setSelected(!selected);
	};
	
	return (
		<button 
			className={classNames("valve-node", { "selected": selected })} 
			onClick={toggle}>
			{id}
			{order > -1 ? <div className="badge">{order}</div> : null}
		</button>
	);
}
export function ValveOverview() {
	const valves = useSelector(state => state.valves);
	const dispatch = useDispatch();
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