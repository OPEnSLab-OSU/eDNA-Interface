import { h } from "preact";
import { useState, useRef, useEffect, StateUpdater } from "preact/hooks";

import { useDispatch, useSelector } from "react-redux";
import { selectTask, setDisplayLoadingScreen } from "App/redux/actions";
import { RootState } from "App/redux/store";
import { API } from "App/API";
import { Task } from "App/redux/models";

import { useForm } from "react-hook-form";
import cn from "classnames";

type FormCreateTaskValuesType = {
	name: string;
};

const FormCreateTask: React.FC<{
	setShowTaskInput: StateUpdater<boolean>;
	showTaskInput: boolean;
}> = ({ setShowTaskInput, showTaskInput }) => {
	const inputRef = useRef<HTMLInputElement>();
	const dispatch = useDispatch();
	const { register, handleSubmit } = useForm<FormCreateTaskValuesType>();

	useEffect(() => {
		showTaskInput && inputRef.current?.focus();
	}, [showTaskInput]);

	const createTask = async (data: FormCreateTaskValuesType) => {
		dispatch(setDisplayLoadingScreen(true));
		const [response, payload] = await API.store.createTaskWithName(data.name);
		if (response.success) {
			dispatch(selectTask(payload.id!));
			setShowTaskInput(false);
		} else {
			console.log(response.error);
		}
		dispatch(setDisplayLoadingScreen(false));
	};

	return (
		<li className={cn("edit")}>
			<form onSubmit={handleSubmit(createTask) as any}>
				<input
					className="task"
					name="name"
					ref={(e: HTMLInputElement | null) => {
						e && register(e);
						e && (inputRef.current = e);
					}}
				/>
				<input
					type="submit"
					style={{
						visibility: "hidden",
						position: "absolute",
					}}
				/>
				<button
					className="button cancel"
					type="button"
					onClick={() => setShowTaskInput(false)}>
					Cancel
				</button>
			</form>
		</li>
	);
};

export function TaskListing() {
	const [showTaskInput, setShowTaskInput] = useState(false);
	const dispatch = useDispatch();
	const panels = useSelector((state: RootState) => state.panels);
	const tasks = useSelector((state: RootState) => state.tasks);
	const selectedTaskId = useSelector((state: RootState) => state.selectedTask);
	const selectedTask = tasks[selectedTaskId];

	const handleTaskSelection = async (id: number) => {
		dispatch(setDisplayLoadingScreen(true));
		await API.store.getTaskWithId(id);
		dispatch(selectTask(id));
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
						onClick={() => setShowTaskInput(true)}>
						Create
					</button>
				)}
			</div>
			<ul>
				{Object.values(tasks)
					.map((t) => t as Task)
					.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
					.map(({ id, name, status }) => (
						<li
							key={id}
							className={cn({ selected: selectedTask?.id === id })}>
							<button type="button" onClick={() => handleTaskSelection(id)}>
								{name}
								<span className="right">
									{status === 1 ? "active" : null}
								</span>
							</button>
						</li>
					))}
				{showTaskInput && (
					<FormCreateTask
						setShowTaskInput={setShowTaskInput}
						showTaskInput={showTaskInput}
					/>
				)}
			</ul>
			<div className="underbar" />
		</div>
	);
}
