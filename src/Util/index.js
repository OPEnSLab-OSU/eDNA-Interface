// ────────────────────────────────────────────────────────────────────────────────
// Return an object with picked properties of another object
// ────────────────────────────────────────────────────────────────────────────────
const pick = (...props) => o => props.reduce((a, e) => {
	if (typeof e === "object") {
		const key = Object.keys(e)[0];
		return { ...a, [key]: o[e[key]] };
	} else {
		return { ...a, [e]: o[e] };
	}
}, {});


// ────────────────────────────────────────────────────────────────────────────────
// Combine two arrays into an array of tuple. See Python's zip for details.
// ────────────────────────────────────────────────────────────────────────────────
const zip = (a, b) => a.map((k, i) => [k, b[i]]);

export { pick, zip };