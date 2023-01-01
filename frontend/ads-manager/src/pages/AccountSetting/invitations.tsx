import React from "react";
import { Table, Row, Pagination, Space } from "antd";
import CustomButton from "src/components/atoms/Button";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import moment from "moment";
import type { ColumnsType } from "antd/es/table";

type DataType = {
  id: number;
  name: string;
  username: string;
  role: string;
  profile: string;
  approver: boolean;
  date: string;
};

const Invitations: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    page: 1,
    perPage: 10,
  });
  const [meta, setMeta] = React.useState({
    itemsPerPage: 10,
    totalItems: 30,
  });

  const data: DataType[] = [
    {
      id: 1,
      name: "Sandi Negara",
      username: "@sandinegara",
      role: "Owner",
      approver: false,
      profile: "./img/person.png",
      date: moment().format(),
    },
    {
      id: 2,
      name: "Renata Christie",
      username: "@renchrist23",
      role: "Administrator",
      approver: false,
      profile: "./img/person.png",
      date: moment().format(),
    },
    {
      id: 3,
      name: "John Doe",
      username: "@johndoe1010",
      role: "Advertise",
      approver: true,
      profile: "./img/person.png",
      date: moment().format(),
    },
    {
      id: 4,
      name: "Queenice Harley Long Name",
      username: "@queenicelongname",
      role: "Analyst",
      approver: true,
      profile: "./img/person.png",
      date: moment().format(),
    },
  ];

  const columns: ColumnsType<DataType> = [
    {
      title: "",
      dataIndex: "profile",
      fixed: "left",
      width: 85,
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
      width: 400,
      render: (text: React.ReactNode, obj: any) => (
        <div className="font-normal">
          <div className="font-semibold text-base">
            {text}
            <span
              className="ml-1 text-xs font-normal"
              style={{ color: "#888888" }}
            >
              {obj?.username}
            </span>
          </div>
          has invited you to Ads Account Name as Analyst.
          <div style={{ color: "#AAAAAA" }}>{moment(obj?.date).fromNow()}</div>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "left",
      render: (txt: string, obj: {}) => (
        <Space>
          <CustomButton
            text="Reject"
            icon={<CloseCircleFilled />}
            secondary
            size="middle"
          />
          <CustomButton
            text="Approve"
            icon={<CheckCircleFilled />}
            size="middle"
          />
        </Space>
      ),
    },
  ];

  const onHandlePagination = (page: number, perPage: number) => {
    setPagination({
      ...pagination,
      page,
      perPage,
    });
  };

  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        loading={loading}
        dataSource={data ?? []}
        pagination={false}
        showHeader={false}
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
    </>
  );
};

export default Invitations;
