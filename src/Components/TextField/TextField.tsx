import { h, FunctionComponent, Fragment } from "preact";
import { ErrorMessage } from "react-hook-form";

export interface TextFieldProps {
	title?: string;
	name?: string;
	helpertext?: string;
	className?: string;
	required?: boolean;
	errors?: string[];
	children?: any;
	disabled?: boolean;
	register?: any;
}

export const TextFieldComponent: FunctionComponent<TextFieldProps> = ({
	title,
	helpertext,
	name,
	className,
	required,
	errors,
	children,
	register,
}) => {
	if (!children && !name) {
		throw new Error("Name is required when using default input");
	}

	// Maybe a duplicate from preact/compat layer
	// We have both className and class props, so remove class
	// Need to do this inorder to fix css dependancy ordering
	// delete (props as any).class;
	const inputComponent = children ?? (
		<Fragment>
			<input
				className="input"
				name={name}
				ref={register}
				required={required}
			/>
			<label className="title" htmlFor={name}>
				{title}
			</label>
		</Fragment>
	);

	const errorComponent =
		!children && errors && name ? (
			<ErrorMessage className="error" errors={errors} name={name} as="p">
				{({ messages }) =>
					messages &&
					Object.entries(messages).map(([type, message]) => (
						<p key={type}>{message}</p>
					))
				}
			</ErrorMessage>
		) : null;

	return (
		<div className={className}>
			{helpertext && <p className="helpertext">{helpertext}</p>}
			{inputComponent}
			{errorComponent ?? null}
		</div>
	);
};

export const BasicTextField: FunctionComponent<TextFieldProps> = (props) => {
	return <TextFieldComponent className="textfield" {...props} />;
};
