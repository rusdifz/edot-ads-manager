import React from "react";
import { Select, Tag } from "antd";
import Icon from "@ant-design/icons";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const { Option } = Select;

const FilterSvg = () => (
	<svg
		width='22'
		height='24'
		viewBox='0 0 22 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'>
		<path
			d='M10.5 8.75L20 8.75'
			stroke='#444444'
			strokeWidth='2'
			strokeLinecap='round'
		/>
		<path
			d='M2 8.75L3.5 8.75'
			stroke='#444444'
			strokeWidth='2'
			strokeLinecap='round'
		/>
		<path
			d='M2 16.75L12 16.75'
			stroke='#444444'
			strokeWidth='2'
			strokeLinecap='round'
		/>
		<path
			d='M18 16.75L20 16.75'
			stroke='#444444'
			strokeWidth='2'
			strokeLinecap='round'
		/>
		<circle cx='15' cy='16.75' r='3' stroke='#444444' strokeWidth='2' />
		<circle cx='7' cy='8.75' r='3' stroke='#444444' strokeWidth='2' />
	</svg>
);

const FilterIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={FilterSvg} {...props} />
);

const tagRender = (props: CustomTagProps) => {
	const { label, value, closable, onClose } = props;
	const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
		event.preventDefault();
		event.stopPropagation();
	};

	return (
		<Tag
			color='#C05FD0'
			onMouseDown={onPreventMouseDown}
			closable={closable}
			onClose={onClose}
			style={{ marginRight: 3, fontSize: 10 }}
			className='flex items-center rounded-full'>
			{label}
		</Tag>
	);
};

const Filter: React.FC<Props> = ({
	id,
	placeholder,
	className,
	options,
	defaultValue,
	handleChange,
	filter,
	tagCount = 2,
	size = "middle",
}) => {
	const handleSelectAll = (value: any) => {
		let selectAll: React.ReactNode[] = [];
		if (value.includes("all")) {
			options?.map((v) => selectAll.push(v.value));
			handleChange(selectAll);
			return;
		}
		handleChange(value);
		return;
	};

	return (
		<Select
			id={id}
			placeholder={placeholder}
			mode='multiple'
			suffixIcon={filter && <FilterIcon />}
			tagRender={tagRender}
			value={defaultValue}
			maxTagCount={tagCount}
			showArrow
			onChange={handleSelectAll}
			className={`custom-select ${className}`}
			maxTagTextLength={6}
			size={size}>
			<Option key='all' value='all' className='bg-gray-200 hover:bg-gray-200'>
				Select All Campaign Objectives
			</Option>
			{options?.map((option, index) => (
				<Option key={index} value={option?.value}>
					{option?.label}
				</Option>
			))}
		</Select>
	);
};

export default Filter;

type Props = {
	id?: string;
	placeholder?: string;
	className?: string;
	defaultValue?: any;
	filter?: boolean;
	tagCount?: number;
	options?: { label: string; value: any }[];
	handleChange: (items: any) => void;
	size?: "large" | "middle" | "small";
};
