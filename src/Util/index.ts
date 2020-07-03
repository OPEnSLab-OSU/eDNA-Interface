//
// ────────────────────────────────────────────────────── I ──────────
//   :::::: H E L P E R S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────
//

// ────────────────────────────────────────────────────────────────────────────────
// Return an object with picked properties of another object
// ────────────────────────────────────────────────────────────────────────────────
// export const pick = (...props) => o =>
// 	props.reduce((a, e) => {
// 		if (typeof e === "object") {
// 			const key = Object.keys(e)[0];
// 			return { ...a, [key]: o[e[key]] };
// 		} else {
// 			return { ...a, [e]: o[e] };
// 		}
// 	}, {});

// ────────────────────────────────────────────────────────────────────────────────
// Combine two arrays into an array of tuple. See Python's zip for details.
// ────────────────────────────────────────────────────────────────────────────────
export const zip = <T, K>(a: T[], b: K[]): [T, K][] => a.map((k, i) => [k, b[i]]);

// ────────────────────────────────────────────────────────────────────────────────
// Convert object to query string
// ────────────────────────────────────────────────────────────────────────────────
export const objectToQueryString = (obj: { [key: string]: any }) => {
	return Object.keys(obj)
		.map((key) => `${key}=${obj[key]}`)
		.join("&");
};

export const partition = <T extends any>(ary: T[], predicate: (elem: T) => boolean) => {
	const a: T[] = [];
	const b: T[] = [];
	ary.forEach((e) => (predicate(e) ? a.push(e) : b.push(e)));
	return [a, b] as const;
};

// ────────────────────────────────────────────────────────────────────────────────
// The server sends tasklist as an array. This method convert array of objects to
// a single level object using the given key as direct properties
// ────────────────────────────────────────────────────────────────────────────────
export const arrayToObject = (array: any[], key: string) => {
	return array.reduce(
		(obj, item) => ({
			...obj,
			[item[key]]: item,
		}),
		{}
	);
};
