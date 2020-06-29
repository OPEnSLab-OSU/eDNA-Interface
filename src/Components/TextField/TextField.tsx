import { h, FunctionComponent } from "preact";
import classNames from "classnames";

export interface TextFieldProps {
	title?: string;
	helpertext?: string;
	className?: string;
	required?: boolean;
	error?: string;
	errors?: string[];
	children?: any;
	disabled?: boolean;
}

export const TextFieldComponent: FunctionComponent<TextFieldProps> = props => {
	const {
		title,
		helpertext,
		className,
		required,
		error,
		errors,
		...componentProps
	} = props;

	// Maybe a duplicate from preact/compat layer
	// We have both className and class props, so remove class
	// Need to do this inorder to fix css dependancy ordering
	delete (componentProps as any).class;

	const inputDOM = (
		<input className={"input"} required={required} {...componentProps} />
	);

	const inputComponent = props.children
		? props.children(componentProps)
		: inputDOM;

	return (
		<div className={classNames(className)}>
			{helpertext && <p className={"helpertext"}>{helpertext}</p>}
			{inputComponent}
			{<label className="title">{title}</label>}
			{error && <p className="error">{error}</p>}
			{errors &&
				errors.map(e => (
					<p className="error" key={e}>
						{e}
					</p>
				))}
		</div>
	);
};

export const BasicTextField: FunctionComponent<TextFieldProps> = props => {
	return <TextFieldComponent className="textfield" {...props} />;
};
