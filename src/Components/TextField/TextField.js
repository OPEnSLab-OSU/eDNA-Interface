import { h } from "preact";
import {} from "preact/hooks";

export const TextFieldComponent = (props) => {
	const {
		title, 
		helpertext, 
		className, 
		required = true, 
		...componentProps 
	} = props;

	// Maybe a duplicate from preact/compat layer
	// We have both className and class props so remove class
	delete componentProps.class; 

	const inputDOM = <input className={"input"}required={required} {...componentProps}/>;
	const inputComponent = props.children ? props.children(componentProps) : inputDOM;

	return (
		<div className={classNames(className)}>
			{inputComponent}
			{<label className="title">{title}</label>}
			{helpertext && <p className={"helpertext"}>{helpertext}</p>}
		</div>
	); 
};
export const BasicTextField = (props) => {
	// const [fields, metas, helpers] = useField(props.name);
	return <TextFieldComponent className="textfield" {...props}/>;
};





