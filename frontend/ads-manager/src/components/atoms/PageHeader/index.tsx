import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "antd";
import CustomButton from "src/components/atoms/Button";
import { SaveOutlined } from "@ant-design/icons";

const PageHeaderComponent: React.FC<Props> = ({
	title,
	subtitle,
	withButton,
	buttonText = "Save",
	onClick,
}) => {
	const navigate = useNavigate();

	return (
		<PageHeader
			className='site-page-header'
			onBack={() => {
				if (withButton) {
					onClick?.();
					return;
				}
				navigate(-1);
			}}
			title={title}
			subTitle={subtitle}
			extra={
				withButton && [
					<CustomButton
						text={buttonText}
						icon={<SaveOutlined />}
						onClick={() => navigate("audience/add")}
					/>,
				]
			}
		/>
	);
};

type Props = {
	title?: string;
	subtitle?: string;
	buttonText?: string;
	withButton?: boolean;
	onClick?: () => void;
};

export default PageHeaderComponent;
