import { h } from "preact";
import { useDispatch } from "react-redux";
import { BasicTextField } from "Components/TextField";

import cn from "classnames";

function capitalizeFirst(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// function FormikConfigField(props) {
// 	const { configName, disabled,  ...property } = props;
// 	const [fields, meta] = useField(configName + capitalizeFirst(property.alias ?? property.name));

// 	return <BasicTextField
// 		type={property.type}
// 		title={property.name}
// 		helpertext={property.description}
// 		error={meta.touched && meta.error}
// 		disabled={disabled}
// 		{...fields}
// 	/>;
// }

function StateConfig({ config, colorIndex, disabled }: any) {
	return (
		<div className="config">
			<h2 className={cn("headline", `background-accent-${colorIndex + 1}`)}>
				{config.name}
				<i className={cn("square", `background-accent-${colorIndex + 1}`)} />
			</h2>
			<div className="content">
				{config.properties.map((property: any) => (
					<BasicTextField
						key={property.name}
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
