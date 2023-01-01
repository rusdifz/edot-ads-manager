import React from "react";
import { useNavigate } from "react-router-dom";
import { Radio, DatePicker } from "antd";
import DefaultLayout from "src/components/defaultLayout";
import CustomButton from "src/components/atoms/Button";
import { PlusOutlined } from "@ant-design/icons";
import Filter from "src/components/organizes/Filter";
import List from "src/components/molecules/List";
import { LineChart } from "src/components/molecules/Chart/lineChart";
import type { DatePickerProps } from "antd";

const { RangePicker } = DatePicker;

const AdsWalet: React.FC = () => {
	const navigate = useNavigate();
	const [filter, setFilter] = React.useState([]);
	const datasets = [
		{
			label: "Campaign Objective A",
			data: [100, 20, 50, 35, 10, 90, 82, 34, 56, 70].reverse(),
			backgroundColor: "#C05FD0",
			borderColor: "#C05FD0",
			lineTension: 0.4,
			//   yAxisID: "y",
		},
		{
			label: "Campaign B",
			data: [100, 20, 50, 35, 10, 90, 82, 34, 56, 70],
			backgroundColor: "#FFAE1B",
			borderColor: "#FFAE1B",
			lineTension: 0.4,
			//   yAxisID: "y1",
		},
	];
	const options = [
		{
			value: "A",
			label: "Campaign Objective A",
		},
		{
			value: "B",
			label: "Campaign B",
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

	const onHandleFilter = (items: any) => {
		setFilter(items);
	};

	const onMonthChange: DatePickerProps["onChange"] = (date, dateString) => {
		console.log(date, dateString);
	};

	const onYearChange: DatePickerProps["onChange"] = (date, dateString) => {
		console.log(date, dateString);
	};

	return (
		<DefaultLayout header='Ads Wallet'>
			<div className='w-full bg-edot-main p-4'>
				<p className='text-xs text-white mb-2'>Balance</p>
				<div
					className='text-lg flex items-center text-edot-primary justify-between py-2 px-4 rounded-full w-fit'
					style={{ backgroundColor: "#FDE6F3", minWidth: 380 }}>
					Rp {Intl.NumberFormat("id-ID").format(850000000000000)}
					<CustomButton
						text='Top up'
						icon={<PlusOutlined />}
						size='middle'
						onClick={() => navigate("topup")}
					/>
				</div>
			</div>
			<div className='flex my-6'>
				<div className='w-2/3'>
					<h2 className='text-xl mb-5'>Spending Analytics</h2>
					<div className='grid grid-cols-12 gap-4'>
						<div className='col-span-5'>
							<Radio.Group defaultValue='week' className='chart-btn w-fit'>
								<Radio.Button
									value='week'
									style={{ borderRadius: "8px 0 0 8px" }}>
									Week
								</Radio.Button>
								<Radio.Button value='month'>Month</Radio.Button>
								<Radio.Button value='year'>Year</Radio.Button>
								<Radio.Button
									value='custom'
									style={{ borderRadius: "0 8px 8px 0" }}>
									Custom
								</Radio.Button>
							</Radio.Group>
						</div>
						<div className='col-span-3'>
							<RangePicker />
						</div>
						<div className='col-span-4 pr-4'>
							<Filter
								className='w-full'
								options={options}
								defaultValue={filter}
								handleChange={onHandleFilter}
								filter
							/>
						</div>
					</div>
					<div className='text-center mt-8 font-normal'>
						Total Spending
						<p className='font-bold pb-6'>
							Rp{Intl.NumberFormat("id").format(7200000)}
						</p>
						<div className='pr-4'>
							<LineChart datasets={datasets} />
						</div>
					</div>
				</div>
				<div className='w-1/3 border-l border-l-gray-200 px-6'>
					<h2 className='text-xl mb-5'>Wallet Activity</h2>
					<div className='mb-5 flex justify-between'>
						<DatePicker
							className='w-full mr-4'
							onChange={onMonthChange}
							picker='month'
						/>
						<DatePicker
							className='w-full'
							onChange={onYearChange}
							picker='year'
						/>
					</div>
					<List />
				</div>
			</div>
		</DefaultLayout>
	);
};

export default AdsWalet;
