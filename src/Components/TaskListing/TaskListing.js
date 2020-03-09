import { Fragment, h } from "preact";
import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import { AppContext } from "App";
import { Formik, useField, useFormik, useFormikContext } from "formik";
import { BasicTextField } from "Components/TextField";

import { useSelector } from "react-redux";


export function TaskListing(props) {
	const panels = useSelector(state => state.panels);
	const tasks = useSelector(state => state.tasks);

	return (
		<div className="tasklisting">
			<div className="headline">
				<div className="title">Tasks</div>
				{panels.task && 
					<button className="create-group">
						+ Task
					</button>
				}
			</div>
			<ul>
				{tasks.map((name, i) => (<li key={i}>{name}</li>))}
			</ul>
			<div className="underbar"></div>
		</div>
	);
}