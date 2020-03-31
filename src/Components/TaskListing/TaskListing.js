import { Fragment, h } from "preact";
import { useContext, useEffect, useReducer, useRef, useState } from "preact/hooks";
import { AppContext } from "App";
import { Field, Form, Formik } from "formik";
import { BasicTextField } from "Components/TextField";

import { useDispatch, useSelector } from "react-redux";

import { addTask, selectTask, updateTask, updateTaskList } from "../../App/redux/actions";
import { base } from "App/Static";

import Schema from "App/Schema";
import API from "App/API";

export function TaskListing() {
	const [editingMode, setEditingMode] = useState(false);
	const toggleEditingMode = () => setEditingMode(!editingMode);

	const dispatch = useDispatch();
	const panels = useSelector(state => state.panels);
	const tasks = useSelector(state => state.tasks);

	const handleTaskSelection = async (name) => {
		const task = await API.post("api/task/get").body(JSON.stringify({ name })).send();
		dispatch(updateTask(task.name, task));
		dispatch(selectTask(task.name));
	};

	const handleTaskAdd = () => setEditingMode(mode => !mode);
	const handleTaskCreate = async (values) => {
		const { [Schema.keys.TASK_NAME]: newTaskName } = values;
		const response = await API.post("api/task/create").body(JSON.stringify(values)).send();
		if (response.success) {
			dispatch(updateTaskList(response.payload));
			dispatch(selectTask(newTaskName));
			setEditingMode(false);
		} else {
			console.log(response.error);
		}
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
					<li key={i} className={classNames({ "selected": tasks.selected === task.name })} 
						onClick={() => handleTaskSelection(task.name)}>
						{task.name}
					</li>
				))}


				{editingMode && 
					<li className={classNames("edit")}>
						<Formik initialValues={{ [Schema.keys.TASK_NAME]: "" }} onSubmit={handleTaskCreate}>{(formik) =>
							<Form>
								<input className="task"
									name={Schema.keys.TASK_NAME}
									ref={ref => ref && ref.focus()} 
									type="text" 
									autoFocus 
									{...formik.getFieldProps(Schema.keys.TASK_NAME)}
								/>

								{/* this is need to make submit via enter work */}
								<input type="submit" style={{ visibility: "hidden", position: "absolute" }} /> 
								<button className="button cancel" onClick={toggleEditingMode}>
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