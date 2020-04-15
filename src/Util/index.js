const pick = (...props) => o => props.reduce((a, e) => {
	if (typeof e === "object") {
		const key = Object.keys(e)[0];
		return { ...a, [key]: o[e[key]] };
	} else {
		return { ...a, [e]: o[e] };
	}
}, {});

export { pick };