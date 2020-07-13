// import Masonry from "masonry-layout";
import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { FormContext, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { selectedTaskSelector } from "App/redux/selectors";

import { StateConfig } from "Components/StateConfig";
import { defaultValuesFromTask, FormValues, TaskConfig } from "Components/TaskConfig";

import { StateConfigData, stateConfigData } from "./stateconfigsdata";

// function MasonryComponen() {
// 	const mason = useRef(new Masonry());
// }

export function TopLevelConfig() {
	const selectedTask = useSelector(selectedTaskSelector)!;
	const hookForm = useForm<FormValues>({
		defaultValues: defaultValuesFromTask(selectedTask),
	});

	return (
		<div className="top-level-config-wrapper">
			<FormContext {...hookForm}>
				<div className="task-wrapper">
					<form>
						<TaskConfig />
					</form>
				</div>
				<div className="config-grid-wrapper">
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
