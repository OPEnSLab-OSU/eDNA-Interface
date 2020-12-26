import { Fragment, h, JSX } from "preact";
import React from "react";
import { ErrorMessage, FieldError, NestDataObject } from "react-hook-form";

export type TextFieldProps = JSX.HTMLAttributes<HTMLInputElement> & {
	helpertext?: string;
	className?: string;
	required?: boolean;
	errors?: NestDataObject<Record<string, any>, FieldError>;
	children?: any;
	register?: any;
};

export const TextFieldComponent = ({
	title,
	helpertext,
	name,
	className,
	required,
	errors,
	children,
	register,
	disabled,
	type,
	...additionalInputProps
}: TextFieldProps) => {
	if (!children && !name) {
		throw new Error("Name is required when using default input");
	}

	// Maybe a duplicate from preact/compat layer
	// We have both className and class props, so remove class
	// Need to do this inorder to fix css dependancy ordering
	// delete (props as any).class;
	const inputComponent = (
		<Fragment>
			<input
				className="input"
				type={type}
				name={name}
				ref={register}
				required={required}
				disabled={disabled}
				{...additionalInputProps}
			/>
		</Fragment>
	);

	const errorComponent =
		errors && name ? (
			<ErrorMessage className="error" errors={errors} name={name} as="p">
				{({ messages }) =>
					messages &&
					Object.entries(messages).map(([errorType, message]) => (
						<p key={errorType}>{message}</p>
					))
				}
			</ErrorMessage>
		) : null;

	return (
		<div className={className}>
			{helpertext && <p className="helpertext">{helpertext}</p>}
			{children ? children() : inputComponent}
			<label className="title" htmlFor={name}>
				{title}
			</label>
			{errorComponent}
		</div>
	);
};

type BasicTextFieldProps = Omit<TextFieldProps, "className">;
export const BasicTextField = (props: BasicTextFieldProps) => {
	return <TextFieldComponent className="textfield" {...props} />;
};
