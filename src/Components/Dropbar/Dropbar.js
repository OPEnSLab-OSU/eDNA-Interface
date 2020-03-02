import { Fragment, h } from "preact";
import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import { useDispatch, useSelector } from "react-redux";

import { togglePanel } from "App/redux/actions";

export function Dropbar() {
	const panels = useSelector(state => state.panels);
	const dispatch = useDispatch();

	return (
		<div className="dropbar">
			<nav className="nav">
				<ul className="left-section">
					<li className={classNames("toggle", { "active": panels.status })} 
						onClick={() => dispatch(togglePanel("status"))}>
						status
					</li>
				</ul>
				<ul className="right-section">
					<li className="toggle">update rtc</li>
					<li className={classNames("toggle", { "active": panels.task })}
						onClick={() => dispatch(togglePanel("task"))}>
						tasks
					</li>
				</ul>
			</nav>
		</div>
	);
}