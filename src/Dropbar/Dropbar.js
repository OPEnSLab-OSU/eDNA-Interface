import { Fragment, h } from "preact";
import { useContext, useEffect, useReducer, useState } from "preact/hooks";

import { useSelector } from "react-redux";

export function Dropbar() {
	const panels = useSelector(state => state.panels);

	return (
		<div className="dropbar">
			<nav className="nav">
				<ul className="left-section">
					<li className={classNames("toggle", { "active": panels.status })} 
						onClick={() =>{}}>
						status
					</li>
				</ul>
				<ul className="right-section">
					<li className="toggle">update rtc</li>
					<li className={classNames("toggle", "active")}>tasks</li>
				</ul>
			</nav>
		</div>
	);
}