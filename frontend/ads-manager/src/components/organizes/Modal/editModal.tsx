import React from "react";
import { Row, Col, Modal, Form } from "antd";
import CustomBotton from "src/components/atoms/Button";
import type { FormInstance } from "antd/es/form";

type Props = {
  children?: React.ReactNode;
  title?: React.ReactNode;
  visible?: boolean;
  handleOk?: () => void;
  handleCancel?: () => void;
  form?: FormInstance<any>;
  onFinish?: (values: any) => void;
  initialValues?: {};
};

const EditModal: React.FC<Props> = ({
  title,
  visible = false,
  handleOk,
  handleCancel,
  onFinish,
  children,
  form,
  initialValues,
}) => {
  return (
    <Modal
      onCancel={handleCancel}
      title={title}
      visible={visible}
      footer={null}
      centered
    >
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        {children}
        <Form.Item className="mb-0">
          <Row className="mt-6" justify="space-between">
            <Col span={11}>
              <CustomBotton
                className="w-full justify-center"
                text="Cancel"
                secondary
                onClick={handleCancel}
              />
            </Col>
            <Col span={11}>
              <CustomBotton
                className="w-full justify-center"
                text="Save"
                htmlType="submit"
              />
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
