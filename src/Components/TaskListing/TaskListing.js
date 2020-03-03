import { Fragment, h } from "preact";
import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import { AppContext } from "App";
import { Formik, useField, useFormik, useFormikContext } from "formik";
import { BasicTextField } from "Components/TextField";

import { useSelector } from "react-redux";


export function TaskListing(props) {
	// const [{ groups }] = useContext(AppContext);
	const panels = useSelector(state => state.panels);
	const groups = useSelector(state => state.groups);
	console.log(groups);

	return (
		<div className="tasklisting">
			<div className="headline">
				<div className="title">Tasks</div>
				{panels.task && 
					<button className="create-group">
							+ Group
					</button>
				}
			</div>
			<ul>
				{groups.map((name, i) => (<li key={i}>{name}</li>))}
			</ul>
			<div className="underbar"></div>
		</div>
	);
}