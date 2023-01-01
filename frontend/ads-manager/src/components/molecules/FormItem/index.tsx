import React from "react";
import { Select, Col, Form, Input } from "antd";
import { NamePath } from "antd/es/form/interface";
import { Rule } from "antd/es/form";

export const FormItem: React.FC<FormType> = ({
	col,
	label,
	className,
	name,
	disabled,
	upload,
	password,
	dependencies,
	inputClass,
	placeholder,
	hasFeedback,
	textarea,
	rules,
	value,
	selectValue,
	extra,
	mode,
	prefix,
	select,
	onChange,
	children,
	size = "middle",
}) => {
	const selected = (
		<Select
			size={size}
			mode={mode}
			value={selectValue}
			disabled={disabled}
			placeholder={placeholder}
			onChange={onChange}>
			{children}
		</Select>
	);

	const textArea = (
		<Input.TextArea
			size={size}
			value={value}
			placeholder={placeholder}
			onChange={onChange}
			maxLength={200}
			style={{ height: 120 }}
			showCount
		/>
	);

	const fieldPassword = (
		<Input.Password
			size={size}
			prefix={prefix}
			className={inputClass}
			placeholder={placeholder}
			onChange={onChange}
		/>
	);
	const input = textarea ? (
		textArea
	) : select ? (
		selected
	) : upload ? (
		children
	) : password ? (
		fieldPassword
	) : (
		<Input
			disabled={disabled}
			size={size}
			value={value}
			prefix={prefix}
			className={inputClass}
			placeholder={placeholder}
			onChange={onChange}
		/>
	);
	return (
		<Col span={col || 24}>
			<Form.Item
				className={className}
				label={label}
				extra={extra}
				name={name}
				dependencies={dependencies}
				rules={rules || undefined}
				hasFeedback={hasFeedback}>
				{input || children}
			</Form.Item>
		</Col>
	);
};

type FormType = {
	hasFeedback?: boolean;
	col?: number;
	value?: string | number | readonly string[] | undefined;
	selectValue?: React.ChangeEvent;
	extra?: string;
	dependencies?: NamePath[] | undefined;
	label?: string;
	name?: string;
	password?: boolean;
	placeholder?: string;
	textarea?: boolean;
	upload?: boolean;
	rules?: Rule[];
	disabled?: boolean;
	onChange?: React.ChangeEventHandler;
	inputClass?: string;
	prefix?: NamePath[] | undefined;
	select?: boolean;
	mode?: "multiple" | "tags" | undefined;
	className?: string;
	children?: React.ReactNode;
	size?: "large" | "middle" | "small";
};
