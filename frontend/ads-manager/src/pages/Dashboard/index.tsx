import React from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "src/components/defaultLayout";
import Search from "src/components/atoms/Search";
import {
	Tabs,
	Table,
	Button,
	Space,
	Switch,
	Popconfirm,
	Row,
	Pagination,
	Popover,
	Divider,
	Form,
	Input,
	Select,
	DatePicker,
} from "antd";
import Icon, {
	UsergroupDeleteOutlined,
	FormOutlined,
	InfoCircleOutlined,
	SearchOutlined,
	PlayCircleOutlined,
	PauseCircleOutlined,
	CheckCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

type DataType = {
	name: string;
	objective: string;
	published: string;
	end: string;
	budget: number;
	durations: number;
	clicks: number;
	conversions: number;
	views: number;
	spent: number;
	status: "pending" | "waiting" | "published" | "rejected" | "live" | "pause";
};
// import moment from 'moment';

const { TabPane } = Tabs;

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

const DetailSvg = () => (
	<svg
		width='24'
		height='24'
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'>
		<path
			d='M20 3H4C2.897 3 2 3.897 2 5V19C2 20.103 2.897 21 4 21H20C21.103 21 22 20.103 22 19V5C22 3.897 21.103 3 20 3ZM4 19V5H20L20.002 19H4Z'
			fill='#AAAAAA'
		/>
		<path d='M6 7H18V9H6V7ZM6 11H18V13H6V11ZM6 15H12V17H6V15Z' fill='#AAAAAA' />
	</svg>
);

const FilterIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={FilterSvg} {...props} />
);
const DetailIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={DetailSvg} {...props} />
);

const Dashboard: React.FC = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = React.useState(false);
	const [filter, setFilter] = React.useState(false);
	const [search, setSearch] = React.useState("");
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
			name: "Campaign JKL",
			objective: "Brand Awareness",
			published: "Aug 18, 2022",
			end: "Aug 24, 2022",
			budget: 500000,
			durations: 7,
			clicks: 0,
			conversions: 0,
			views: 0,
			spent: 0,
			status: "pending",
		},
		{
			name: "Campaign JKL",
			objective: "Brand Awareness",
			published: "Aug 18, 2022",
			end: "Aug 24, 2022",
			budget: 500000,
			durations: 7,
			clicks: 0,
			conversions: 0,
			views: 0,
			spent: 0,
			status: "waiting",
		},
		{
			name: "Campaign JKL",
			objective: "Brand Awareness",
			published: "Aug 18, 2022",
			end: "Aug 24, 2022",
			budget: 500000,
			durations: 10,
			clicks: 0,
			conversions: 0,
			views: 0,
			spent: 0,
			status: "rejected",
		},
		{
			name: "Campaign JKL",
			objective: "Brand Awareness",
			published: "Aug 18, 2022",
			end: "Aug 24, 2022",
			budget: 500000,
			durations: 10,
			clicks: 0,
			conversions: 0,
			views: 0,
			spent: 0,
			status: "live",
		},
		{
			name: "Campaign JKL",
			objective: "Brand Awareness",
			published: "Aug 18, 2022",
			end: "Aug 24, 2022",
			budget: 500000,
			durations: 7,
			clicks: 0,
			conversions: 0,
			views: 0,
			spent: 0,
			status: "published",
		},
		{
			name: "Campaign JKL",
			objective: "Brand Awareness",
			published: "Aug 18, 2022",
			end: "Aug 24, 2022",
			budget: 500000,
			durations: 7,
			clicks: 0,
			conversions: 0,
			views: 0,
			spent: 0,
			status: "pause",
		},
	];

	const columns: ColumnsType<DataType> = [
		{
			title: "Campaign Name",
			dataIndex: "name",
		},
		{
			title: "Objective",
			align: "left",
			dataIndex: "objective",
			width: 200,
		},
		{
			title: "Published Date",
			align: "left",
			dataIndex: "published",
		},
		{
			title: "End Date",
			align: "left",
			dataIndex: "end",
		},
		{
			title: "Budget Limit",
			align: "left",
			dataIndex: "budget",
			render: (budget: number) => {
				return <span>IDR {Intl.NumberFormat("id").format(budget)}</span>;
			},
		},
		{
			title: "Total Durations",
			align: "left",
			dataIndex: "durations",
			render: (duration: number) => {
				return <span>{duration > 7 ? "Continuous" : `${duration} Days`}</span>;
			},
		},
		{
			title: "Total Clicks",
			align: "left",
			dataIndex: "clicks",
			render: (item: number) => {
				return (
					<span>{item === 0 ? "-" : Intl.NumberFormat("id").format(item)}</span>
				);
			},
		},
		{
			title: "Total Conversions",
			align: "left",
			dataIndex: "conversions",
			render: (item: number) => {
				return (
					<span>{item === 0 ? "-" : Intl.NumberFormat("id").format(item)}</span>
				);
			},
		},
		{
			title: "Total Views",
			align: "left",
			dataIndex: "views",
			render: (item: number) => {
				return (
					<span>{item === 0 ? "-" : Intl.NumberFormat("id").format(item)}</span>
				);
			},
		},
		{
			title: "Status",
			align: "left",
			width: 240,
			dataIndex: "status",
			render: (item: string) => {
				return (
					<>
						{item === "pending" && (
							<div
								id='ads-status'
								className='bg-[#FFFBDF]'
								style={{ width: 160 }}>
								<span className='w-1 h-1 block rounded-full bg-[#FFB400] mr-2' />
								Pending Approval
							</div>
						)}
						{item === "waiting" && (
							<div
								id='ads-status'
								className='bg-[#FFFBDF]'
								style={{ width: 200 }}>
								<span className='w-1 h-1 block rounded-full bg-[#FFB400] mr-2' />
								Waiting for your approval
							</div>
						)}
						{item === "rejected" && (
							<div id='ads-status' className='bg-[#FFE4E5]'>
								<span className='w-1 h-1 block rounded-full bg-[#C81A19] mr-2' />
								Rejected
							</div>
						)}
						{item === "live" && (
							<div id='ads-status' className='bg-[#E2FFF3]'>
								<span className='w-1 h-1 block rounded-full bg-[#00C572] mr-2' />
								Live
							</div>
						)}
						{item === "published" && (
							<div id='ads-status' className='bg-[#E2FFF3]'>
								<span className='w-1 h-1 block rounded-full bg-[#2BBECB] mr-2' />
								Published
							</div>
						)}
						{item === "pause" && (
							<div id='ads-status' className='bg-[#F4F4F4]'>
								<span className='w-1 h-1 block rounded-full bg-[#DDDDDD] mr-2' />
								Paused
							</div>
						)}
					</>
				);
			},
		},
		{
			title: "",
			dataIndex: "action",
			align: "center",
			fixed: "right",
			render: (txt: string, obj: any) => (
				<div className='flex items-center'>
					{obj?.status === "rejected" && (
						<Button
							type='text'
							onClick={() => onHandleUpdate(obj)}
							className='flex items-center'>
							<FormOutlined style={{ color: "#AAAAAA", fontSize: 20 }} />
						</Button>
					)}
					{obj?.status === "waiting" && (
						<Button
							type='text'
							onClick={() => onHandleUpdate(obj)}
							className='flex items-center'>
							<CheckCircleOutlined style={{ color: "#AAAAAA", fontSize: 20 }} />
						</Button>
					)}
					{obj?.status === "live" && (
						<Button
							type='text'
							onClick={() => onHandleUpdate(obj)}
							className='flex items-center'>
							<PauseCircleOutlined style={{ color: "#AAAAAA", fontSize: 20 }} />
						</Button>
					)}
					{obj?.status === "pause" && (
						<Button
							type='text'
							onClick={() => onHandleUpdate(obj)}
							className='flex items-center'>
							<PlayCircleOutlined style={{ color: "#AAAAAA", fontSize: 20 }} />
						</Button>
					)}
					<Button
						type='text'
						onClick={() => navigate("detail/1")}
						className='flex items-center'>
						<DetailIcon />
					</Button>
					{/* <Button type="text" className="flex items-center">
            <UsergroupDeleteOutlined
              style={{ color: "#AAAAAA", fontSize: 18 }}
            />
            Remove
          </Button> */}
				</div>
			),
		},
	];

	const handleSwitch = (val: boolean) => {
		console.log(val);
	};

	const onHandleUpdate = (value: any) => {
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

	return (
		<DefaultLayout header='Ads Dashboard'>
			<div className='flex items-center gap-2 justify-end'>
				<button
					type='button'
					className='mr-2 outline-none flex items-center'
					onClick={() => setFilter(!filter)}>
					<FilterIcon className='text-lg' />
				</button>
				<Search
					className='max-w-xs'
					value={search}
					placeholder='Search Ads'
					onChange={(e) => setSearch(e.target.value)}
					disabled={filter}
				/>
			</div>
			<div id='filter-search' className={`mt-4 ${filter ? "show" : ""}`}>
				<div className='pt-8 pb-4 px-4'>
					<div className='w-full flex items-center gap-4'>
						<div className='w-1/4'>
							<Form.Item name='name'>
								<Input
									placeholder='Campaign Name'
									prefix={<SearchOutlined style={{ color: "#BBC3CF" }} />}
								/>
							</Form.Item>
						</div>
						<div className='w-1/4'>
							<Form.Item label='Ads Status' name='status'>
								<Select defaultValue='all'>
									<Select.Option value='all'>All Status</Select.Option>
								</Select>
							</Form.Item>
						</div>
						<div className='w-1/4'>
							<Form.Item label='Ads Objective' name='objective'>
								<Select defaultValue='all'>
									<Select.Option value='all'>All Objective</Select.Option>
								</Select>
							</Form.Item>
						</div>
						<div className='w-1/4'>
							<Form.Item label='Placement' name='placement'>
								<Select defaultValue='all'>
									<Select.Option value='all'>All Placement</Select.Option>
								</Select>
							</Form.Item>
						</div>
					</div>

					<div className='w-full flex items-center gap-4'>
						<div className='w-1/3'>
							<Form.Item label='Published Date' name='start'>
								<DatePicker placeholder='Date Range' className='w-full' />
							</Form.Item>
						</div>
						<div className='w-1/3'>
							<Form.Item label='End Date' name='end'>
								<DatePicker placeholder='Date Range' className='w-full' />
							</Form.Item>
						</div>
						<div className='w-1/3'>
							<Form.Item label='Total Spent'>
								<Space className='max-w-fit'>
									<Input
										name='spentMin'
										placeholder='0'
										prefix={<span>IDR</span>}
									/>
									-
									<Input
										name='spentMax'
										placeholder='0'
										prefix={<span>IDR</span>}
									/>
								</Space>
							</Form.Item>
						</div>
					</div>

					<div className='w-full flex items-center gap-4'>
						<div className='w-1/3'>
							<Form.Item label='Cost per View'>
								<Space className='max-w-fit'>
									<Input
										name='viewMin'
										placeholder='0'
										prefix={<span>IDR</span>}
									/>
									-
									<Input
										name='viewMax'
										placeholder='0'
										prefix={<span>IDR</span>}
									/>
								</Space>
							</Form.Item>
						</div>
						<div className='w-1/3'>
							<Form.Item label='Cost per Click'>
								<Space className='max-w-fit'>
									<Input
										name='clickMin'
										placeholder='0'
										prefix={<span>IDR</span>}
									/>
									-
									<Input
										name='clickMax'
										placeholder='0'
										prefix={<span>IDR</span>}
									/>
								</Space>
							</Form.Item>
						</div>
						<div className='w-1/3'>
							<Form.Item label='Cost per Conversion'>
								<Space className='max-w-fit'>
									<Input
										name='conversionMin'
										placeholder='0'
										prefix={<span>IDR</span>}
									/>
									-
									<Input
										name='conversionMax'
										placeholder='0'
										prefix={<span>IDR</span>}
									/>
								</Space>
							</Form.Item>
						</div>
					</div>

					<div className='w-full flex items-center gap-4'>
						<div className='w-1/3'>
							<Form.Item label='Total Durations'>
								<Space className='max-w-fit'>
									<Input
										name='durationStart'
										placeholder='0'
										suffix={<span>Days</span>}
									/>
									-
									<Input
										name='durationEnd'
										placeholder='0'
										suffix={<span>Days</span>}
									/>
								</Space>
							</Form.Item>
						</div>
						<div className='w-1/3'>
							<Form.Item label='Total Views'>
								<Space className='max-w-fit'>
									<Input
										name='viewStart'
										placeholder='0'
										suffix={<span>Views</span>}
									/>
									-
									<Input
										name='viewEnd'
										placeholder='0'
										suffix={<span>Views</span>}
									/>
								</Space>
							</Form.Item>
						</div>
						<div className='w-1/3'>
							<Form.Item label='Total Clicks'>
								<Space className='max-w-fit'>
									<Input
										name='clickStart'
										placeholder='0'
										suffix={<span>Clicks</span>}
									/>
									-
									<Input
										name='clickEnd'
										placeholder='0'
										suffix={<span>Clicks</span>}
									/>
								</Space>
							</Form.Item>
						</div>
						<div className='w-1/4'>
							<button type='button' className='text-edot-primary text-sm mb-6'>
								Reset Filter
							</button>
						</div>
					</div>
				</div>
			</div>
			<Table
				rowKey='id'
				columns={columns}
				loading={loading}
				dataSource={data ?? []}
				pagination={false}
				className='mt-6'
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
		</DefaultLayout>
	);
};

export default Dashboard;
