import { h } from "preact";
import { FormContext, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { selectedTaskSelector } from "App/redux/selectors";

import { StateConfig } from "Components/StateConfig";
import { defaultValuesFromTask, FormValues, TaskConfig } from "Components/TaskConfig";

import { stateConfigData } from "./stateconfigsdata";

export function TopLevelConfig() {
	const selectedTask = useSelector(selectedTaskSelector)!;

	const hookForm = useForm<FormValues>({
		defaultValues: defaultValuesFromTask(selectedTask),
	});

	return (
		<div className="stateconfig">
			<FormContext {...hookForm}>
				<form>
					<div className="column">
						<TaskConfig />
					</div>
				</form>
				<div className="column">
					<StateConfig
						config={stateConfigData.flush}
						register={hookForm.register}
						colorIndex={0}
						disabled={selectedTask.status === 1}
					/>
					<StateConfig
						config={stateConfigData.sample}
						register={hookForm.register}
						colorIndex={1}
						disabled={selectedTask.status === 1}
					/>
					<StateConfig
						config={stateConfigData.dry}
						register={hookForm.register}
						colorIndex={2}
						disabled={selectedTask.status === 1}
					/>
					<StateConfig
						config={stateConfigData.preserve}
						register={hookForm.register}
						colorIndex={3}
						disabled={selectedTask.status === 1}
					/>
				</div>
			</FormContext>
		</div>
	);
}
