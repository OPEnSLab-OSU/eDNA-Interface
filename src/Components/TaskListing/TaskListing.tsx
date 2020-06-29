import { h } from "preact";
import { useState } from "preact/hooks";
import { Form, Formik } from "formik";

import { useDispatch, useSelector } from "react-redux";
import { selectTask, setDisplayLoadingScreen } from "App/redux/actions";
import API from "App/API";
import { RootState } from "App/redux/store";
import { Task } from "App";

import classNames from "classnames";

export function TaskListing() {
	const [editingMode, setEditingMode] = useState(false);
	const toggleEditingMode = () => setEditingMode(!editingMode);

	const dispatch = useDispatch();
	const panels = useSelector((state: RootState) => state.panels);
	const tasks = useSelector((state: RootState) => state.tasks);
	const selectedTaskId = useSelector((state: RootState) => state.selectedTask);
	const selectedTask = tasks[selectedTaskId];

	console.log(tasks);

	// NOTE: Handlers
	const handleTaskSelection = async (id: number) => {
		dispatch(setDisplayLoadingScreen(true));
		await API.store.getTaskWithId(id);
		dispatch(selectTask(id));
		dispatch(setDisplayLoadingScreen(false));
	};

	const handleTaskCreate = async (values: any) => {
		dispatch(setDisplayLoadingScreen(true));
		const { name } = values;
		const [response, payload] = await API.store.createTaskWithName(name);
		if (response.success) {
			dispatch(selectTask(payload.id!));
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
				{panels.task && (
					<button
						type="button"
						className="create-group"
						onClick={() => setEditingMode(mode => !mode)}>
						Create
					</button>
				)}
			</div>
			<ul>
				{Object.values(tasks)
					.map(t => t as Task)
					.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
					.map(({ id, name, status }) => (
						<li
							key={id}
							className={classNames({
								selected: selectedTask && selectedTask.id === id,
							})}
							onClick={() => handleTaskSelection(id)}>
							{name}
							<span class="right">
								{status == 1 ? "active" : null}
							</span>
						</li>
					))}

				{editingMode && (
					<li className={classNames("edit")}>
						<Formik
							initialValues={{ name: "" }}
							onSubmit={handleTaskCreate}>
							{formik => (
								<Form>
									<input
										className="task"
										ref={ref => ref && ref.focus()}
										autoFocus
										{...formik.getFieldProps("name")}
									/>

									{/* this is need to make submit via enter work */}
									<input
										type="submit"
										style={{
											visibility: "hidden",
											position: "absolute",
										}}
									/>
									<button
										className="button cancel"
										onClick={toggleEditingMode}>
										Cancel
									</button>
								</Form>
							)}
						</Formik>
					</li>
				)}
			</ul>
			<div className="underbar"></div>
		</div>
	);
}
