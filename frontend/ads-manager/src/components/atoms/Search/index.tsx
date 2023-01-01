import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

const Search: React.FC<Props> = ({
	name,
	className,
	onChange,
	placeholder,
	size = "middle",
	value,
	disabled,
}) => {
	return (
		<Input
			name={name}
			size={size}
			placeholder={placeholder}
			prefix={<SearchOutlined style={{ color: "#BBC3CF" }} />}
			value={value}
			onChange={onChange}
			className={`rounded-lg px-4 py-2 min-w-xs ${className}`}
			disabled={disabled}
		/>
	);
};

type Props = {
	name?: string;
	placeholder?: string;
	value?: string;
	className?: string;
	size?: "middle" | "large" | "small";
	disabled?: boolean;
	onChange?: (e: any) => void;
};

export default Search;
