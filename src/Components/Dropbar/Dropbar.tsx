import classNames from "classnames";
import { h } from "preact";
import { useDispatch, useSelector } from "react-redux";

import { API } from "App/API";
import { setDisplayLoadingScreen, togglePanel } from "App/redux/actions";
import { RootState } from "App/redux/store";

export function Dropbar() {
	const panels = useSelector((state: RootState) => state.panels);
	const dispatch = useDispatch();

	// timeZoneOffset is used to report local time in server
	const updateRTC = async () => {
		const payload = {
			utc: Math.floor(Date.now() / 1000),
			timezoneOffset: new Date().getTimezoneOffset(),
		};

		dispatch(setDisplayLoadingScreen(true));
		await API.post("api/rtc/update").json(payload).send();
		dispatch(setDisplayLoadingScreen(false));
	};

	return (
		<div className="dropbar">
			<nav className="nav">
				<ul className="left-section">
					<button
						type="button"
						className={classNames("toggle", { active: panels.status })}
						onClick={() => dispatch(togglePanel("status"))}>
						status
					</button>
				</ul>
				<ul className="right-section">
					<button type="button" className="toggle" onClick={updateRTC}>
						update rtc
					</button>
					<button
						type="button"
						className={classNames("toggle", { active: panels.task })}
						onClick={() => dispatch(togglePanel("task"))}>
						tasks
					</button>
				</ul>
			</nav>
		</div>
	);
}
