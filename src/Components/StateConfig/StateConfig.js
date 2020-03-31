import { Fragment, h } from "preact";
import { useContext, useEffect, useReducer, useState } from "preact/hooks";
import { Formik, useField, useFormik, useFormikContext } from "formik";

import { useSelector } from "react-redux";
import { actions, toggleValveSelection } from "App/redux/actions";

import { BasicTextField } from "Components";


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
						type={type}
						title={section.name} 
						helpertext={section.description} 
					/>
				))}
			</div>
		</div>
	);
}


function StateConfig(_) {
	const configs = useSelector(state => state.stateConfigs);
	const { flush, sample, clean, preserve } = configs;

	return (
		<div className="stateconfig">
			<div className="column">
				<Config config={flush} index={0} type="number" />
				<Config config={sample} index={1} type="number"/>
			</div>
			<div className="column">
				<Config config={clean} index={2} type="number"/>
				<Config config={preserve} index={3} type="number" />
			</div>
		</div>
	);
}

export { StateConfig };