

import { Fragment, h } from "preact";
import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import { AppContext } from "App";
import { Formik, useField, useFormik, useFormikContext } from "formik";
import { BasicTextField } from "Components/TextField";

import { useDispatch, useSelector } from "react-redux";


import { actions } from "App/redux/actions";
import { toggleValveSelection } from "../../App/redux/actions";

import { css } from "@emotion/core";

const nodeColors = ["#173F5F", "#20639B", "#3CAEA3", "#ED553B"];

function Config(props) {
	const { config, index } = props;
	return (
		<div className="config">
			<h2 className="headline" style={`background: ${nodeColors[index % nodeColors.length]}`}>
				{config.name}
			</h2>
			{config.configs.map((section, i)=> (
				<BasicTextField 
					key={i} title={section.name} 
					type="text"
					helpertext={section.description} 
				/>
			))}
		</div>
	);
}


function StateConfig(props) {
	const configs = useSelector(state => state.stateConfigs);
	const flushConfig = configs.flush;
	const sampleConfig = configs.sample;
	const cleanConfig = configs.clean;
	const preserveConfig = configs.preserve;
	return (
		<div className="stateconfig">
			<div className="column">
				<Config config={flushConfig} index={0} />
				<Config config={sampleConfig} index={1}/>
			</div>
			<div className="column">
				<Config config={cleanConfig} index={2} />
				<Config config={preserveConfig} index={3} />
			</div>
		</div>
	);
}

export { StateConfig };