import { h } from "preact";
import { useDispatch, useSelector } from "react-redux";
import { setDisplayLoadingScreen, togglePanel } from "App/redux/actions";

import API from "App/API";

export function Dropbar() {
	const panels = useSelector(state => state.panels);
	const dispatch = useDispatch();

	const updateRTC = async () => {
		dispatch(setDisplayLoadingScreen(true));
		await API.post("api/rtc/update")
			.json({
				utc: Math.floor(Date.now() / 1000), 
				timezoneOffset: new Date().getTimezoneOffset() 
			}).send();
		dispatch(setDisplayLoadingScreen(false));
	};

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
					<li className="toggle" onClick={updateRTC}>update rtc</li>
					<li className={classNames("toggle", { "active": panels.task })}
						onClick={() => dispatch(togglePanel("task"))}>
						tasks
					</li>
				</ul>
			</nav>
		</div>
	);
}