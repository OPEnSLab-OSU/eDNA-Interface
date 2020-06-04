
import { h } from "preact";
// const keys = { 9: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1, 40: 1, };

function preventDefault(e) {
	e = e || window.event;
	if (e.preventDefault) {
		e.preventDefault();
	}
	e.returnValue = false;
}

function preventDefaultForKeys(_) {
	return false;
}

function disableScroll() {
	if (window.addEventListener) { 											
		window.addEventListener("DOMMouseScroll", preventDefault, false);	// older FF
	}
	
	document.addEventListener("wheel", preventDefault, { passive: false }); // Disable scrolling in Chrome
	window.onwheel = preventDefault; 										// modern standard
	window.onmousewheel = document.onmousewheel = preventDefault; 			// older browsers, IE
	window.ontouchmove = preventDefault; 									// mobile
	document.onkeydown = preventDefaultForKeys;
}

function enableScroll() {
	if (window.removeEventListener) {
		window.removeEventListener("DOMMouseScroll", preventDefault, false);
	}

	document.removeEventListener("wheel", preventDefault, { passive: false }); // Enable scrolling in Chrome
	window.onmousewheel = document.onmousewheel = null;
	window.onwheel = null;
	window.ontouchmove = null;
	document.onkeydown = null;
}

function LoadingScreen(props) {
	if (props.hide) {
		enableScroll();
	} else {
		disableScroll();
	}

	return (
		<div className={classNames("loading-screen", { hide: props.hide })}>
			<div className="obj"></div>
			<div className="obj"></div>
			<div className="obj"></div>
			<div className="obj"></div>
			<div className="obj"></div>
		</div>
	);
}

export { LoadingScreen };