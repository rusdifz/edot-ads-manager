import { Button } from "antd";
import { CSSProperties } from "react";

type Props = {
  text?: React.ReactNode;
  icon?: React.ReactNode;
  className?: React.ReactNode;
  style?: CSSProperties | undefined;
  onClick?: () => void;
  secondary?: React.ReactNode;
  size?: "large" | "middle" | "small";
  htmlType?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const ButtonComponent: React.FC<Props> = ({
  text,
  icon = false,
  onClick = () => console.log("action"),
  secondary = false,
  size = "large",
  htmlType = "button",
  className,
  style,
  disabled,
}) => {
  return (
    <Button
      className={`${
        secondary ? "edot-btn-secondary" : "edot-btn-primary"
      } flex items-center ${className}`}
      shape="round"
      icon={icon}
      size={size}
      onClick={onClick}
      type={`${secondary ? "default" : "primary"}`}
      htmlType={htmlType}
      style={style}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

export default ButtonComponent;
