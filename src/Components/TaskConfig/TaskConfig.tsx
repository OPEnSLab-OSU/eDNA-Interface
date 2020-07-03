import { h } from "preact";
import { useDispatch } from "react-redux";
import Switch from "react-switch";

import { FaRegTrashAlt } from "react-icons/fa";
import { zip } from "Util";

//
// ────────────────────────────────────────────────────── I ──────────
//   :::::: H E L P E R S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────
//

const secondsToTimeString = (seconds: number): string => {
	if (seconds === 0) {
		return "0 second";
	}

	const day = Math.floor(seconds / (3600 * 24));
	const hour = Math.floor((seconds % (3600 * 24)) / 3600);
	const min = Math.floor((seconds % 3600) / 60);
	const sec = Math.floor(seconds % 60);

	const values = [day, hour, min, sec];
	const tokens = ["day", "hour", "minute", "second"];

	return zip(values, tokens)
		.filter((e) => e[0] > 0)
		.map((e) => (e[0] > 1 ? e.join(" ") : `${e.join(" ")}s`))
		.join();
};

const displayRuntime = (values: any) => {
	const { flushTime, sampleTime, dryTime, preserveTime } = values;
	return secondsToTimeString(flushTime + sampleTime + dryTime + preserveTime);
};

//
// ──────────────────────────────────────────────────────────── II ──────────
//   :::::: T A S K C O N F I G : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────
//

export function TaskConfig(props: any) {
	return <div />;
}
