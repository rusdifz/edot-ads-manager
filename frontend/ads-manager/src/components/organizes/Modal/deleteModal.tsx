import React from "react";
import { Row, Col, Modal } from "antd";
import CustomBotton from "src/components/atoms/Button";

type Props = {
  title?: React.ReactNode;
  text?: React.ReactNode;
  visible?: boolean;
  handleOk?: () => void;
  handleCancel?: () => void;
};

const AlertModal: React.FC<Props> = ({
  title,
  text,
  visible = false,
  handleOk,
  handleCancel,
}) => {
  return (
    <Modal
      width={380}
      closable={false}
      visible={visible}
      footer={null}
      centered
    >
      <div className="text-lg font-semibold leading-6">{title}</div>
      <p className="text-base mt-2" style={{ color: "#AAAAAA" }}>
        {text}
      </p>
      <Row className="mt-6" justify="end">
        <Col span={7} className="mr-2">
          <CustomBotton
            className="w-full justify-center"
            text="Cancel"
            secondary
            onClick={handleCancel}
          />
        </Col>
        <Col span={7}>
          <CustomBotton
            className="w-full justify-center"
            text="Confirm"
            onClick={handleOk}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default AlertModal;
