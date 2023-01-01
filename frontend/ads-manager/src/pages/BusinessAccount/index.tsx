import React from "react";
import { Table, Row, Pagination, Space, Button, Divider } from "antd";
import DefaultLayout from "src/components/defaultLayout";
import { ExportOutlined, FormOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

type DataType = {
  id: string;
  name: string;
  type: string;
};

const ManageAds: React.FC = () => {
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
      id: "ID213019213088",
      name: "My Shop A",
      type: "personal",
    },
    {
      id: "ID213019213089",
      name: "My Shop B",
      type: "business",
    },
    {
      id: "ID213019213087",
      name: "My Shop",
      type: "personal",
    },
  ];

  const columns: ColumnsType<DataType> = [
    {
      title: "Account ID",
      dataIndex: "id",
      fixed: "left",
    },
    {
      title: "Account Name",
      dataIndex: "name",
      fixed: "left",
      render: (text: React.ReactNode, obj: any) => (
        <div className="flex items-center">
          {text}
          <div
            className={`${
              obj?.type === "personal" ? "neutral-badge" : "primary-badge"
            } text-xs ml-2 capitalize`}
          >
            {obj?.type}
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "left",
      render: (txt: string, obj: {}) => (
        <Space split={<Divider type="vertical" />}>
          <Button type="text" className="flex items-center">
            <FormOutlined style={{ color: "#AAAAAA", fontSize: 18 }} /> Rename
          </Button>
          <Button type="text" className="flex items-center">
            <ExportOutlined style={{ color: "#AAAAAA", fontSize: 18 }} />
            Remove
          </Button>
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
    <DefaultLayout header="Business Account Home Page">
      <h2 className="text-lg mb-6">List of Ads Account</h2>
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
    </DefaultLayout>
  );
};

export default ManageAds;
