import { Fragment, h } from "preact";
import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import { Formik, useField, useFormik, useFormikContext } from "formik";

import { useDispatch, useSelector } from "react-redux";
import { actions, toggleValveSelection } from "App/redux/actions";

import { BasicTextField } from "Components/TextField";



function Config(props) {
	const { config, index, type } = props;
	return (
		<div className="config">
			<h2 className={classNames("headline", "background-accent-" + (index + 1))}>
				{config.name}
				<i className={classNames("square", "background-accent-" + (index + 1))}></i>
			</h2>
			<div className="content">
				{config.configs.map((section, i) => (
					<BasicTextField key={i} 
						title={section.name} 
						type={type}
						helpertext={section.description} 
					/>
				))}
			</div>
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
				<Config config={flushConfig} index={0} type="number" />
				<Config config={sampleConfig} index={1} type="number"/>
			</div>
			<div className="column">
				<Config config={cleanConfig} index={2} type="number"/>
				<Config config={preserveConfig} index={3} type="number" />
			</div>
		</div>
	);
}

export { StateConfig };