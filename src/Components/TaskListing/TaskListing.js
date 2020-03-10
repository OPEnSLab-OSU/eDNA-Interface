import { Fragment, h } from "preact";
import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import { AppContext } from "App";
import { Formik, useField, useFormik, useFormikContext } from "formik";
import { BasicTextField } from "Components/TextField";

import { useDispatch, useSelector } from "react-redux";

import { selectTask, updateTask, updateTaskList } from "../../App/redux/actions";
import { base } from "App/Static";

export function TaskListing(props) {
	const panels = useSelector(state => state.panels);
	const tasks = useSelector(state => state.tasks);
	const dispatch = useDispatch();

	const handleTaskSelection = (name) => {
		fetch(new URL("/api/task", base), {
			method: "POST",
			body: JSON.stringify({ name })
		}).then(res => res.json()).then(task => {
			dispatch(updateTask(task.name, task));
			dispatch(selectTask(task.name));
		});
	};

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
				{tasks.all.map((task, i) => (
					<li key={i} className={classNames({ "selected": tasks.selected === task.name })}onClick={() => handleTaskSelection(task.name)}>
						{task.name}
					</li>
				))}
			</ul>
			<div className="underbar"></div>
		</div>
	);
}