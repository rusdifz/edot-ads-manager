import React from "react";
import DefaultLayout from "src/components/defaultLayout";
import {
  Tabs,
  Table,
  Button,
  Space,
  Switch,
  Row,
  Pagination,
  Popover,
  Divider,
  Form,
  Select,
} from "antd";
import { FormItem } from "src/components/molecules/FormItem";
import CustomButton from "src/components/atoms/Button";
import {
  UsergroupDeleteOutlined,
  FormOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import EditModal from "src/components/organizes/Modal/editModal";
import AlertModal from "src/components/organizes/Modal/deleteModal";
import { Message } from "src/components/atoms/Message";
import Invitations from "./invitations";
import Requests from "./requests";

type DataType = {
  id: number;
  name: string;
  username: string;
  role: string;
  profile: string;
  approver: boolean;
};
// import moment from 'moment';

const { TabPane } = Tabs;
const { Option } = Select;

const AccountSetting: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [modal, setModal] = React.useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [formData, setFormData] = React.useState({
    username: "@renchrist23",
    role: "Administrator",
  });
  const [pagination, setPagination] = React.useState({
    page: 1,
    perPage: 10,
  });
  const [meta, setMeta] = React.useState({
    itemsPerPage: 10,
    totalItems: 30,
  });
  const text = "Are you sure to delete this task?";
  const popoverContent = (
    <div>Approver will review the ads before published</div>
  );

  const data: DataType[] = [
    {
      id: 1,
      name: "Sandi Negara",
      username: "@sandinegara",
      role: "Owner",
      approver: false,
      profile: "./img/person.png",
    },
    {
      id: 2,
      name: "Renata Christie",
      username: "@renchrist23",
      role: "Administrator",
      approver: false,
      profile: "./img/person.png",
    },
    {
      id: 3,
      name: "John Doe",
      username: "@johndoe1010",
      role: "Advertise",
      approver: true,
      profile: "./img/person.png",
    },
    {
      id: 4,
      name: "Queenice Harley Long Name",
      username: "@queenicelongname",
      role: "Analyst",
      approver: true,
      profile: "./img/person.png",
    },
  ];

  const columns: ColumnsType<DataType> = [
    {
      title: "",
      dataIndex: "profile",
      fixed: "left",
      width: 70,
      render: (text: React.ReactNode, obj: any) => (
        <div className="img-profile">
          <img src={`${text}`} alt={`${obj?.name}`} />
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      fixed: "left",
      width: 200,
      render: (text: React.ReactNode, obj: any) => (
        <div className="flex items-center">
          {text}
          {obj?.id === 1 && (
            <span
              className="secondary-badge text-[10px] ml-2"
              style={{
                padding: "2px 8px",
              }}
            >
              Me
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Username",
      width: 150,
      align: "left",
      dataIndex: "username",
    },
    {
      title: "Role",
      align: "left",
      width: 110,
      dataIndex: "role",
    },
    {
      title: ({ sortOrder, sortColumn, filters }) => (
        <div className="flex items-center justify-center">
          Approver
          <Popover
            className="ml-1"
            placement="bottomLeft"
            content={popoverContent}
            trigger="hover"
          >
            <div className="flex items-center justify-center">
              <InfoCircleOutlined />
            </div>
          </Popover>
        </div>
      ),
      width: 130,
      align: "center",
      dataIndex: "approver",
      render: (approver: boolean) => {
        console.log(approver);
        return (
          <Switch
            defaultChecked={approver}
            onChange={() => handleSwitch(approver)}
          />
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 200,
      align: "center",
      render: (txt: string, obj: {}) => (
        <Space split={<Divider type="vertical" />}>
          <Button
            type="text"
            onClick={() => onHandleUpdate(obj)}
            className="flex items-center"
          >
            <FormOutlined style={{ color: "#AAAAAA", fontSize: 18 }} /> Edit
          </Button>
          <Button
            type="text"
            className="flex items-center"
            onClick={() => setModal((prev) => ({ ...prev, delete: true }))}
          >
            <UsergroupDeleteOutlined
              style={{ color: "#AAAAAA", fontSize: 18 }}
            />
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  const handleSwitch = (val: boolean) => {
    console.log(val);
  };

  const onHandleUpdate = (value: any) => {
    setModal((prev) => ({ ...prev, edit: true }));
    console.log(value);
  };

  const onHandleDeleteProduct = (value: any) => {
    console.log(value);
  };

  const onHandlePagination = (page: number, perPage: number) => {
    setPagination({
      ...pagination,
      page,
      perPage,
    });
  };

  const handleEditModal = (val: boolean) => {
    setModal((prev) => ({ ...prev, edit: !val }));
  };

  const handleDeleteModal = (val: boolean) => {
    setModal((prev) => ({ ...prev, delete: !val }));
    Message({ type: "success", text: "Set Approver success!" });
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  return (
    <DefaultLayout header="Ads Account Setting">
      <Tabs>
        <TabPane tab={<div>Member</div>} key="1">
          <div className="mb-4">
            <CustomButton text="Invite New Member" icon={<PlusOutlined />} />
          </div>
          <Table
            rowKey="id"
            columns={columns}
            loading={loading}
            dataSource={data ?? []}
            pagination={false}
          />
          <Row justify="end" className="mt-6">
            <Pagination
              defaultCurrent={pagination.page}
              total={meta?.totalItems}
              pageSize={pagination.perPage}
              onChange={(page, pageSize) => onHandlePagination(page, pageSize)}
              showTotal={(total, range) =>
                `Showing ${range[0]} - ${range[1]} from ${total} entries`
              }
              showSizeChanger
            />
          </Row>
        </TabPane>
        <TabPane
          tab={
            <div className="flex">
              Invitation
              <span className="notif-badge ml-1">2</span>
            </div>
          }
          key="2"
        >
          <Invitations />
        </TabPane>
        <TabPane tab={<div>My Request</div>} key="3">
          <Requests />
        </TabPane>
      </Tabs>

      <EditModal
        title="Edit Role Member"
        visible={modal.edit}
        handleCancel={() => handleEditModal(modal.edit)}
        handleOk={() => handleEditModal(modal.edit)}
        form={form}
        initialValues={formData}
        onFinish={onFinish}
      >
        <FormItem
          label="Username"
          name="username"
          placeholder="input username"
          disabled
        />
        <FormItem label="Role" name="role" placeholder="select role" select>
          <Option value="Administrator">Administrator</Option>
          <Option value="Advertiser">Advertiser</Option>
          <Option value="Analyst">Analyst</Option>
        </FormItem>
      </EditModal>

      <AlertModal
        title={`Are you sure to set ${formData.username} as an Approver?`}
        text="This action cannot be undone."
        visible={modal.delete}
        handleCancel={() => handleDeleteModal(modal.delete)}
        handleOk={() => handleDeleteModal(modal.delete)}
      />
    </DefaultLayout>
  );
};

export default AccountSetting;
