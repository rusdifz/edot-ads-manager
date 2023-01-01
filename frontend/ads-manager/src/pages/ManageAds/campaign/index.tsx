// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import { Table, Row, Pagination, Button, Form, Image, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import CustomButton from "src/components/atoms/Button";
import Search from "src/components/atoms/Search";
import Filter from "src/components/organizes/Filter";
import Icon, {
	DeleteOutlined,
	FormOutlined,
	PlusOutlined,
	CopyOutlined,
} from "@ant-design/icons";
import moment from "moment";
import type { ColumnsType } from "antd/es/table";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

type DataType = {
	id: number;
	img: string;
	name: string;
	objective: string;
	audience: string;
	content: string;
	description: string;
	updated: string;
	status: "draft" | "rejected" | "live" | "pending" | "published";
};

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

const ChatSvg = () => (
	<svg
		width='16'
		height='16'
		viewBox='0 0 16 16'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'>
		<path
			d='M9.19961 0.799805C8.88135 0.799805 8.57612 0.926233 8.35108 1.15128C8.12604 1.37632 7.99961 1.68154 7.99961 1.9998V5.9998C7.99961 6.31806 8.12604 6.62329 8.35108 6.84833C8.57612 7.07338 8.88135 7.1998 9.19961 7.1998H13.9996C14.3179 7.1998 14.6231 7.07338 14.8481 6.84833C15.0732 6.62329 15.1996 6.31806 15.1996 5.9998V1.9998C15.1996 1.68154 15.0732 1.37632 14.8481 1.15128C14.6231 0.926233 14.3179 0.799805 13.9996 0.799805H9.19961ZM9.99961 4.7998H13.1996C13.3057 4.7998 13.4074 4.84195 13.4825 4.91696C13.5575 4.99198 13.5996 5.09372 13.5996 5.1998C13.5996 5.30589 13.5575 5.40763 13.4825 5.48265C13.4074 5.55766 13.3057 5.5998 13.1996 5.5998H9.99961C9.89352 5.5998 9.79178 5.55766 9.71677 5.48265C9.64175 5.40763 9.59961 5.30589 9.59961 5.1998C9.59961 5.09372 9.64175 4.99198 9.71677 4.91696C9.79178 4.84195 9.89352 4.7998 9.99961 4.7998ZM9.59961 2.7998C9.59961 2.69372 9.64175 2.59198 9.71677 2.51696C9.79178 2.44195 9.89352 2.3998 9.99961 2.3998H13.1996C13.3057 2.3998 13.4074 2.44195 13.4825 2.51696C13.5575 2.59198 13.5996 2.69372 13.5996 2.7998C13.5996 2.90589 13.5575 3.00763 13.4825 3.08265C13.4074 3.15766 13.3057 3.1998 13.1996 3.1998H9.99961C9.89352 3.1998 9.79178 3.15766 9.71677 3.08265C9.64175 3.00763 9.59961 2.90589 9.59961 2.7998ZM3.67961 2.3998H7.19961V5.9998C7.19961 6.53024 7.41032 7.03895 7.7854 7.41402C8.16047 7.78909 8.66918 7.9998 9.19961 7.9998H13.9996C14.1364 7.9998 14.27 7.9862 14.3996 7.9598V9.82061C14.3996 10.955 13.4684 11.8734 12.3196 11.8734H8.64761L5.43881 14.2422C5.26851 14.3677 5.05572 14.4214 4.84626 14.3916C4.63679 14.3619 4.44739 14.251 4.31881 14.083C4.21574 13.9472 4.15984 13.7815 4.15961 13.611V11.8734H3.67961C2.53081 11.8734 1.59961 10.9542 1.59961 9.82061V4.4526C1.59961 3.319 2.53081 2.3998 3.67961 2.3998Z'
			fill='#444444'
		/>
	</svg>
);

const FilterIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={FilterSvg} {...props} />
);

const ChatIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={ChatSvg} {...props} />
);

const Campaigns: React.FC = () => {
	const navigate = useNavigate();
	const descRef = React.useRef([]);
	const spanRef = React.useRef([]);
	const [loading, setLoading] = React.useState(false);
	const [filter, setFilter] = React.useState(false);
	const [search, setSearch] = React.useState("");
	const [filterSelect, setFilterSelect] = React.useState([]);
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
			img: "./img/default-img.png",
			name: "Campaign JKL",
			objective: "Brand Awareness",
			audience: "Audience 1",
			content: "Banner e-shop",
			description:
				"Lorem ipsum dolor sit amet lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
			updated: moment().format(),
			status: "draft",
		},
		{
			id: 2,
			img: "./img/default-img.png",
			name: "Campaign JKL",
			objective: "Brand Awareness",
			audience: "Audience 1",
			content: "Banner e-shop",
			description:
				"Lorem ipsum dolor sit amet lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
			updated: moment().format(),
			status: "rejected",
		},
		{
			id: 3,
			img: "./img/default-img.png",
			name: "Campaign JKL",
			objective: "Brand Awareness",
			audience: "Audience 1",
			content: "Banner e-shop",
			description:
				"Lorem ipsum dolor sit amet lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
			updated: moment().format(),
			status: "live",
		},
		{
			id: 4,
			img: "./img/default-img.png",
			name: "Campaign JKL",
			objective: "Brand Awareness",
			audience: "Audience 1",
			content: "Banner e-shop",
			description:
				"Lorem ipsum dolor sit amet lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
			updated: moment().format(),
			status: "pending",
		},
		{
			id: 5,
			img: "./img/default-img.png",
			name: "Campaign JKL",
			objective: "Brand Awareness",
			audience: "Audience 1",
			content: "Banner e-shop",
			description:
				"Lorem ipsum dolor sit amet lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
			updated: moment().format(),
			status: "published",
		},
	];

	const columns: ColumnsType<DataType> = [
		{
			title: "",
			dataIndex: "img",
			width: 200,
			render: (img: React.ReactNode) => (
				<div className='img-campaign'>
					<Image src={img} />
				</div>
			),
		},
		{
			title: "Campaign Name",
			dataIndex: "name",
		},
		{
			title: "Objective",
			dataIndex: "objective",
		},
		{
			title: "Audience",
			dataIndex: "audience",
		},
		{
			title: "Content Name",
			dataIndex: "content",
		},
		{
			title: "Description",
			dataIndex: "description",
			width: 250,
			render: (desc: string, obj: any, index: any) => {
				const showMore = () => {
					if (descRef.current[index].classList.contains("truncate")) {
						descRef.current[index].classList.remove("truncate");
						descRef.current[index].classList.remove("max-w-[250px]");
						spanRef.current[index].innerText = "Hide Description";
					} else {
						descRef.current[index].classList.add("truncate");
						descRef.current[index].classList.add("max-w-[250px]");
						spanRef.current[index].innerText = "Show Description";
					}
				};

				return (
					<div>
						<p
							className='truncate max-w-[250px]'
							ref={(el) => (descRef.current[index] = el)}>
							{desc}
						</p>
						<span
							className='text-[#aaaaaa] italic text-xs font-normal cursor-pointer'
							onClick={showMore}
							ref={(el) => (spanRef.current[index] = el)}>
							Show Description
						</span>
					</div>
				);
			},
		},
		{
			title: "Last Updated",
			dataIndex: "updated",
			render: (date: string) => moment(date).format("MMM DD, yyyy h:mm A"),
		},
		{
			title: "Status",
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
						{item === "rejected" && (
							<div className='flex items-center'>
								<div id='ads-status' className='bg-[#FFE4E5]'>
									<span className='w-1 h-1 block rounded-full bg-[#C81A19] mr-2' />
									Rejected
								</div>
								<ChatIcon className='text-sm ml-2 cursor-pointer' />
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
						{item === "draft" && (
							<div id='ads-status' className='bg-[#F4F4F4]'>
								<span className='w-1 h-1 block rounded-full bg-[#DDDDDD] mr-2' />
								Draft
							</div>
						)}
					</>
				);
			},
		},
		{
			title: "Action",
			dataIndex: "action",
			align: "center",
			fixed: "right",
			width: 180,
			render: (txt: string, obj: any) => (
				<div className='flex items-center'>
					{(obj?.status === "rejected" || obj?.status === "draft") && (
						<Button type='text' className='flex items-center'>
							<FormOutlined style={{ color: "#AAAAAA", fontSize: 20 }} />
						</Button>
					)}
					{obj?.status !== "rejected" && (
						<Button type='text' className='flex items-center'>
							<CopyOutlined style={{ color: "#AAAAAA", fontSize: 20 }} />
						</Button>
					)}
					{(obj?.status === "rejected" || obj?.status === "draft") && (
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

	const onHandleFilter = (items: any) => {
		setFilterSelect(items);
	};

	const options = [
		{
			value: "Brand Awareness",
			label: "Brand Awareness",
		},
		{
			value: "Reach",
			label: "Reach",
		},
		{
			value: "C",
			label: "Campaign C",
		},
		{
			value: "D",
			label: "Campaign Objective D",
		},
		{
			value: "E",
			label: "Campaign Objective E",
		},
		{
			value: "F",
			label: "Campaign Objective F",
		},
		{
			value: "G",
			label: "Campaign Objective G",
		},
	];

	// React.useEffect(() => {
	// 	if (data) {
	// 		setTimeout(() => {
	// 			if (tableRef.current.length !== data.length) {
	// 				// add or remove refs
	// 				tableRef.current = Array(data.length)
	// 					.fill()
	// 					.map((_, i) => tableRef.current[i] || React.createRef());
	// 			}
	// 		}, 400);
	// 	}

	// 	// return () => {
	// 	// 	second;
	// 	// };
	// }, [tableRef]);

	return (
		<>
			<div className='flex'>
				<div className='w-2/3 flex items-center gap-2'>
					<Search
						className='max-w-xs'
						value={search}
						placeholder='Search Ads'
						onChange={(e) => setSearch(e.target.value)}
					/>
					<button
						type='button'
						className='ml-2 outline-none flex items-center'
						onClick={() => setFilter(!filter)}>
						<FilterIcon className='text-lg' />
					</button>
				</div>
				<div className='w-1/3 flex justify-end'>
					<CustomButton
						text='Create New Campaign'
						icon={<PlusOutlined />}
						onClick={() => navigate("campaign/add")}
					/>
				</div>
			</div>
			<div id='filter-search' className={`mt-4 ${filter ? "show" : ""}`}>
				<div className='pt-8 pb-4 px-4'>
					<div className='w-full flex items-center gap-4'>
						<div className='w-2/3'>
							<Form.Item label='Campaign Objective'>
								<Filter
									className='w-full'
									tagCount={4}
									options={options}
									defaultValue={filterSelect}
									handleChange={onHandleFilter}
								/>
							</Form.Item>
						</div>
						<div className='w-2/3'>
							<Form.Item label='Last Updated'>
								<DatePicker placeholder='Date Range' className='w-full' />
							</Form.Item>
						</div>
						<div className='w-1/3'>
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

export default Campaigns;
