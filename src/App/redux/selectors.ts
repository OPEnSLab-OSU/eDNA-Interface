import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "./store";

export const selectedTaskSelector = createSelector(
	[(state: RootState) => state.tasks, (state: RootState) => state.selectedTask],
	(tasks, selectedTaskId) => tasks[selectedTaskId]
);
