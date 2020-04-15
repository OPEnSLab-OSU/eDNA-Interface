import { Fragment, h } from "preact";
import { useState } from "preact/hooks";
import { Form, Formik } from "formik";

import { useDispatch, useSelector } from "react-redux";
import { selectTask, setDisplayLoadingScreen } from "../../App/redux/actions";
import Schema from "App/Schema";
import API from "App/API";

export function TaskListing() {
	const [editingMode, setEditingMode] = useState(false);
	const toggleEditingMode = () => setEditingMode(!editingMode);

	const dispatch = useDispatch();
	const panels = useSelector(state => state.panels);
	const tasks = useSelector(state => state.tasks);
	const selectedName = useSelector(state => state.selectedTask);
	const selected = tasks[selectedName];

	// console.trace(tasks);

	// NOTE: Handlers 
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
		const { [Schema.keys.TASK_NAME]: newTaskName } = values;
		const response = await API.store.createTaskWithName(newTaskName);
		if (response.success) {
			dispatch(selectTask(newTaskName));
			setEditingMode(false);
		} else {
			console.log(response.error);
		}
		dispatch(setDisplayLoadingScreen(false));
	}; 

	const taskList = Object.values(tasks).sort((a, b) => b.name < a.name);
	
	return (
		<div className="tasklisting">
			<div className="headline">
				<div className="title">Tasks</div>
				{panels.task && 
					<button type="button" className="create-group" onClick={handleTaskAdd}>
						+ Task
					</button>
				}
			</div>
			<ul>
				{taskList.map((task, i) => (
					<li key={i} className={classNames({ "selected": selected && selected.name === task.name })} 
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