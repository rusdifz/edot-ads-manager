import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Row, Pagination, Button, Form, Image, DatePicker } from "antd";
import CustomButton from "src/components/atoms/Button";
import Search from "src/components/atoms/Search";
import {
	DeleteOutlined,
	FormOutlined,
	PlusOutlined,
	CopyOutlined,
} from "@ant-design/icons";
import moment from "moment";
import type { ColumnsType } from "antd/es/table";

type DataType = {
	id: number;
	name: string;
	location: string;
	gender: string;
	age: string;
	interest: string;
	updated: string;
	usage: {};
};

const Audiences: React.FC = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = React.useState(false);
	const [search, setSearch] = React.useState("");
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
			name: "Audience 1",
			location: "DKI Jakarta, Bandung, Tangerang",
			gender: "All",
			age: "25-31",
			interest: "F&B, Entertainment",
			updated: moment().format(),
			usage: {
				published: 0,
				live: 4,
				draft: 0,
				interest: 4,
			},
		},
		{
			id: 2,
			name: "Audience 1",
			location: "DKI Jakarta, Bandung, Tangerang",
			gender: "All",
			age: "25-31",
			interest: "F&B, Entertainment",
			updated: moment().format(),
			usage: {
				published: 0,
				live: 0,
				draft: 0,
				interest: 4,
			},
		},
	];

	const columns: ColumnsType<DataType> = [
		{
			title: "Audience Name",
			dataIndex: "name",
		},
		{
			title: "Locations",
			dataIndex: "location",
		},
		{
			title: "Gender",
			dataIndex: "gender",
		},
		{
			title: "Age",
			dataIndex: "age",
		},
		{
			title: "Interest",
			dataIndex: "interest",
		},
		{
			title: "Last Updated",
			dataIndex: "updated",
			render: (date: string) => moment(date).format("MMM DD, yyyy h:mm A"),
		},
		{
			title: "Usage",
			dataIndex: "usage",
			width: 360,
			render: (item: any) => {
				return (
					<div className='flex gap-2 font-normal'>
						<div className='bg-[#F4FBFC] px-3 py-1 text-xs rounded-full'>
							{item?.published} Published
						</div>
						<div className='bg-[#E2FFF3] px-3 py-1 text-xs rounded-full'>
							{item?.live} Live
						</div>
						<div className='bg-[#F4F4F4] px-3 py-1 text-xs rounded-full'>
							{item?.draft} Draft
						</div>
						<div className='bg-[#FDE6F3] px-3 py-1 text-xs rounded-full'>
							{item?.interest} Interest
						</div>
					</div>
				);
			},
		},
		{
			title: "Action",
			dataIndex: "action",
			align: "center",
			fixed: "right",
			// width: 180,
			render: (txt: string, obj: any) => (
				<div className='flex items-center'>
					{obj?.usage.live === 0 && (
						<Button type='text' className='flex items-center'>
							<FormOutlined style={{ color: "#AAAAAA", fontSize: 20 }} />
						</Button>
					)}
					<Button type='text' className='flex items-center'>
						<CopyOutlined style={{ color: "#AAAAAA", fontSize: 20 }} />
					</Button>
					{obj?.usage.live === 0 && (
						<Button type='text' className='flex items-center'>
							<DeleteOutlined style={{ color: "#AAAAAA", fontSize: 20 }} />
						</Button>
					)}
				</div>
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
			<div className='flex'>
				<div className='w-2/3 flex items-center gap-2'>
					<Search
						className='max-w-xs'
						value={search}
						placeholder='Audience Name'
						onChange={(e) => setSearch(e.target.value)}
					/>
					<div className='flex items-center ml-6'>
						<Form.Item label='Last Updated' className='mb-0'>
							<DatePicker
								placeholder='Date Range'
								size='large'
								className='w-60'
							/>
						</Form.Item>
						<button type='button' className='text-edot-primary ml-4'>
							Reset Filter
						</button>
					</div>
				</div>
				<div className='w-1/3 flex justify-end'>
					<CustomButton
						text='Create New Audience'
						icon={<PlusOutlined />}
						onClick={() => navigate("audience/add")}
					/>
				</div>
			</div>

			<Table
				rowKey='id'
				columns={columns}
				loading={loading}
				dataSource={data ?? []}
				pagination={false}
				className='mt-4'
				scroll={{ x: 1500 }}
			/>
			<Row justify='end' className='mt-6'>
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

export default Audiences;
