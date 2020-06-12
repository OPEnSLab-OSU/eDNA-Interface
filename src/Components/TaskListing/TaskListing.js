import { h } from "preact";
import { useState } from "preact/hooks";
import { Form, Formik } from "formik";

import { useDispatch, useSelector } from "react-redux";
import { selectTask, setDisplayLoadingScreen } from "../../App/redux/actions";
import * as models from "App/Models";
import API from "App/API";

export function TaskListing() {
	const [editingMode, setEditingMode] = useState(false);
	const toggleEditingMode = () => setEditingMode(!editingMode);

	const dispatch = useDispatch();
	const panels = useSelector(state => state.panels);
	const tasks = useSelector(state => state.tasks);
	const taskname = useSelector(state => state.selectedTask);
	const task = tasks[taskname];
	
	// NOTE: Handlers s
	const handleTaskSelection = async (name) => {
		dispatch(setDisplayLoadingScreen(true));
		await API.store.getTaskWithName(name);
		dispatch(selectTask(name));
		dispatch(setDisplayLoadingScreen(false));
	};

	const handleTaskAdd = () => {
		setEditingMode(mode => !mode); 
	};

	const handleTaskCreate = async (values) => {
		dispatch(setDisplayLoadingScreen(true));
		const { [models.keys.TASK_NAME]: newTaskName } = values;
		const response = await API.store.createTaskWithName(newTaskName);
		if (response.success) {
			dispatch(selectTask(newTaskName));
			setEditingMode(false);
		} else {
			console.log(response.error);
		}
		dispatch(setDisplayLoadingScreen(false));
	}; 
	
	return (
		<div className="tasklisting">
			<div className="headline">
				<div className="title">Tasks</div>

				{/* CONDITIONAL: conditional rendering */}
				{panels.task && 
				<button type="button" className="create-group" onClick={handleTaskAdd}>
					Create
				</button>}
			</div>
			<ul>
				{Object.values(tasks).sort((a, b) => b.name < a.name).map(({ name, status }) => (
					<li key={name} className={classNames({ "selected": task && task.name === name })} 
						onClick={() => handleTaskSelection(name)}>
						{name}<span class="right">{status == 1 ? "active" : null}</span>
					</li>

				))}

				{/* CONDITIONAL: conditional rendering */}
				{editingMode && 
				<li className={classNames("edit")}>
					<Formik initialValues={{ name: "" }} onSubmit={handleTaskCreate}>{(formik) =>
						<Form>
							<input className="task"
								name={"name"}
								ref={ref => ref && ref.focus()} 
								autoFocus 
								{...formik.getFieldProps("name")}
							/>

							{/* this is need to make submit via enter work */}
							<input type="submit" style={{ visibility: "hidden", position: "absolute" }} /> 
							<button className="button cancel" onClick={toggleEditingMode}>
								Cancel
							</button>
						</Form>
					}</Formik>
				</li>}
			</ul>
			<div className="underbar"></div>
		</div>
	);
}