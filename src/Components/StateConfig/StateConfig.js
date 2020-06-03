import { h } from "preact";
import { useField } from "formik";
import { useDispatch } from "react-redux";

import { BasicTextField } from "Components";
import Schema from "App/Schema";

function capitalizeFirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function FormikConfigField(props) {
	const { configName, disabled,  ...property } = props;
	const [fields, meta] = useField(configName + capitalizeFirst(property.alias ?? property.name));

	return <BasicTextField
		type={property.type}
		title={property.name} 
		helpertext={property.description} 
		error={meta.touched && meta.error}
		disabled={disabled}
		{...fields}
	/>;
}

function StateConfig(props) {
	const { config, colorIndex, disabled } = props;

	return (
		<div className="config">
			<h2 className={classNames("headline", "background-accent-" + (colorIndex + 1))}>
				{config.name}
				<i className={classNames("square", "background-accent-" + (colorIndex + 1))}></i>
			</h2>
			<div className="content">
				{config.properties.map((property, i) => (
					<FormikConfigField key={i}
						configName={config.name}
						disabled={disabled}
						{...property}
					/>
				))}
			</div>
		</div>
	);
}

export { StateConfig };