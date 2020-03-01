import { Fragment, h } from "preact";
import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import { AppContext } from "App";
import { Formik, useField, useFormik, useFormikContext } from "formik";
import { BasicTextField } from "Components/TextField";

import { useSelector } from "react-redux";


export function TaskListing(props) {
	// const [{ groups }] = useContext(AppContext);

	const groups = useSelector(state => state.groups);
	console.log(groups);

	return (
		<div className="tasklisting">
			<div className="headline">Tasks</div>
			<ul>
				{groups.map((name, i) => (<li key={i}>{name}</li>))}
			</ul>
		</div>
	);
}