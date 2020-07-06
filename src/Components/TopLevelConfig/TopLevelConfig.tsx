import { h } from "preact";
import { FormContext, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { selectedTaskSelector } from "App/redux/selectors";

import { StateConfig } from "Components/StateConfig";
import { defaultValuesFromTask, FormValues, TaskConfig } from "Components/TaskConfig";

import { StateConfigData, stateConfigData } from "./stateconfigsdata";

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
					{["flush", "sample", "dry", "preserve"].map((name, i) => (
						<StateConfig
							key={name}
							config={(stateConfigData as any)[name] as StateConfigData}
							register={hookForm.register}
							colorIndex={i}
							disabled={selectedTask.status === 1}
						/>
					))}
				</div>
			</FormContext>
		</div>
	);
}
