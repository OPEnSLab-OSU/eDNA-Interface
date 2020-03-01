import { h } from "preact";
import { useContext, useState } from "preact/hooks";
import { AppContext } from "App";

import { useSelector } from "react-redux"; 

export function Status() {
	const panels = useSelector(state => state.panels);
	
	// const toggleStatusBar = () => {
	// 	setApp({ ...app, statusPanel: !app.statusPanel });
	// };

	return (
		<div className={classNames("status", { "expanded": panels.status })}>
			<ul className="items">
				<li className={classNames("item", "button", { "active": panels.status })} 
					onClick={() => {}}>
					<a className={classNames("active")}>
						Hold
					</a>
				</li>
				<li className={classNames("item", "button")}>
					<a className={classNames("active")}>
							-----
					</a>
				</li>
			</ul>
		</div>
	);
}