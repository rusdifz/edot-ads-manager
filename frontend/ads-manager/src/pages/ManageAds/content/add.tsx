import React from "react";
import DefaultLayout from "src/components/defaultLayout";
import PageHeader from "src/components/atoms/PageHeader";
import CustomButton from "src/components/atoms/Button";
import SelectMultiple from "src/components/organizes/Filter";
import { FormItem } from "src/components/molecules/FormItem";
import { Form, Select, Divider } from "antd";

const { Option } = Select;

const AddContent: React.FC = () => {
	const [form] = Form.useForm();
	const [filterSelect, setFilterSelect] = React.useState([]);

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

	const onHandleFilter = (items: any) => {
		setFilterSelect(items);
	};

	const onFinish = (values: any) => {
		console.log("Success:", values);
	};

	return (
		<DefaultLayout header='Ads Wallet'>
			<PageHeader title='Create New Content' />
			<div className='mobile-payment'>
				<Form
					form={form}
					className='w-2/4 mt-10'
					autoComplete='off'
					layout='vertical'
					onFinish={onFinish}>
					<FormItem
						label='Content Name'
						name='name'
						size='large'
						placeholder='Type Content Name'
					/>
					<Form.Item name='placement' label='Placement'>
						<SelectMultiple
							id='placement'
							className='w-full'
							placeholder='Select Placement'
							tagCount={4}
							options={options}
							defaultValue={filterSelect}
							handleChange={onHandleFilter}
							size='large'
						/>
					</Form.Item>
					<Divider className='border-t-[4px] pb-5' />
					<FormItem
						label='Placement and content'
						name='placementContent'
						placeholder='Select Placement and Content'
						size='large'
						select>
						<Option value='Caption'>Caption</Option>
						<Option value='Placement 2'>Placement 2</Option>
						<Option value='Placement 3'>Placement 3</Option>
					</FormItem>
					<FormItem
						className='pb-8'
						label='Caption'
						name='caption'
						placeholder='Type Caption'
						size='large'
						textarea
					/>
					<CustomButton
						text='Save Content'
						className='mx-auto'
						onClick={() => console.log("CLICK")}
					/>
				</Form>
			</div>
		</DefaultLayout>
	);
};

export default AddContent;
