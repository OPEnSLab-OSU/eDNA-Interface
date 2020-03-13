import { Fragment, h } from "preact";
import { useContext, useEffect, useReducer, useRef, useState } from "preact/hooks";
import { AppContext } from "App";
import { Field, Form, Formik } from "formik";
import { BasicTextField } from "Components/TextField";

import { useDispatch, useSelector } from "react-redux";

import { addTask, selectTask, updateTask, updateTaskList } from "../../App/redux/actions";
import { base } from "App/Static";

import Schema from "../../App/Schema";

export function TaskListing(props) {
	const [editingMode, setEditingMode] = useState(false);
	const dispatch = useDispatch();
	const panels = useSelector(state => state.panels);
	let tasks = useSelector(state => state.tasks);

	const handleTaskSelection = (name) => {
		fetch(new URL("/api/get-task", base), {
			method: "POST",
			body: JSON.stringify({ name })
		}).then(res => res.json()).then(task => {
			dispatch(updateTask(task.name, task));
			dispatch(selectTask(task.name));
		});
	};

	const handleTaskAdd = () => {
		if (editingMode) {
			setEditingMode(false);
		} else {
			setEditingMode(true);
		}
	};

	const handleSubmit = (values) => {
		const { [Schema.keys.TASK_NAME]: newTaskName } = values;
		fetch(new URL("/api/create-task", base), {
			method: "POST",
			body: JSON.stringify(values)
		}).then(res => res.json()).then(tasks => {
			dispatch(updateTaskList(tasks));
			dispatch(selectTask(newTaskName));
		});

		setEditingMode(false);
	}; 
	
	return (
		<div className="tasklisting">
			<div className="headline">
				<div className="title">Tasks</div>
				{panels.task && 
					<button className="create-group" onClick={handleTaskAdd}>
						+ Task
					</button>
				}
			</div>
			<ul>
				{tasks.all.map((task, i) => (
					<li key={i} className={classNames({ "selected": tasks.selected === task.name })} onClick={() => handleTaskSelection(task.name)}>
						{task.name}
					</li>
				))}

				{editingMode && 
					<li className={classNames("edit")}>
						<Formik initialValues={{ [Schema.keys.TASK_NAME]: "" }} onSubmit={handleSubmit}>{(formik) =>
							<Form>
								<input className="task"
									name={Schema.keys.TASK_NAME}
									ref={ref => ref && ref.focus()} 
									type="text" 
									autoFocus 
									{...formik.getFieldProps(Schema.keys.TASK_NAME)}
								/>
								<input type="submit" style={{ visibility: "hidden", position: "absolute" }} /> {/* this is need to make submit via enter work */}
								<button className="button cancel" onClick={() => setEditingMode(false)}>
									Cancel
								</button>
							</Form>
						}</Formik>
					</li>
				}
			</ul>
			<div className="underbar"></div>
		</div>
	);
}