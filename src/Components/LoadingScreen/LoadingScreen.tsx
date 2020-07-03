import { h } from "preact";
import classNames from "classnames";
// const keys = { 9: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1, 40: 1, };

function preventDefault(e: Event) {
	const event = e || window.event;
	if (event.preventDefault) {
		event.preventDefault();
	}
	event.returnValue = false;
}

function preventDefaultForKeys() {
	return false;
}

function disableScroll() {
	if (window.addEventListener) {
		window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
	}

	document.addEventListener("wheel", preventDefault, { passive: false }); // Disable scrolling in Chrome
	window.onwheel = preventDefault; // modern standard
	window.onmousewheel = preventDefault; // older browsers, IE
	(document as any).onmousewheel = preventDefault;
	window.ontouchmove = preventDefault; // mobile
	document.onkeydown = preventDefaultForKeys;
}

function enableScroll() {
	if (window.removeEventListener) {
		window.removeEventListener("DOMMouseScroll", preventDefault, false);
	}

	document.removeEventListener("wheel", preventDefault, {
		passive: false,
	} as EventListenerOptions); // Enable scrolling in Chrome
	window.onmousewheel = null;
	(document as any).onmousewheel = null;
	window.onwheel = null;
	window.ontouchmove = null;
	document.onkeydown = null;
}

const LoadingScreen: React.FC<{ hide: boolean }> = ({ hide }) => {
	if (hide) {
		enableScroll();
	} else {
		disableScroll();
	}

	return (
		<div className={classNames("loading-screen", { hide })}>
			<div className="obj" />
			<div className="obj" />
			<div className="obj" />
			<div className="obj" />
			<div className="obj" />
		</div>
	);
};

export { LoadingScreen };
