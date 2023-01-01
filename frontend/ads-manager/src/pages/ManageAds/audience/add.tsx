import React from "react";
import DefaultLayout from "src/components/defaultLayout";
import PageHeader from "src/components/atoms/PageHeader";
import CustomButton from "src/components/atoms/Button";
import { FormItem } from "src/components/molecules/FormItem";
import { Form, Select, Radio, TreeSelect, Input, Space } from "antd";
import type { RadioChangeEvent } from "antd";

const { Option } = Select;

const AddAudience: React.FC = () => {
	const [form] = Form.useForm();
	const [value, setValue] = React.useState(1);
	const treeData = [
		{
			title: "Aceh",
			value: "0-0",
			key: "0-0",
			children: [
				{
					title: "Child Node1",
					value: "0-0-0",
					key: "0-0-0",
				},
			],
		},
		{
			title: "Bali",
			value: "0-2",
			key: "0-0",
			children: [
				{
					title: "Child Node1",
					value: "0-0-0",
					key: "0-0-0",
				},
			],
		},
		{
			title: "DKI Jakarta",
			value: "0-1",
			key: "0-1",
			children: [
				{
					title: "Kep. Seribu",
					value: "0-1-0",
					key: "0-1-0",
				},
				{
					title: "Jakarta Barat",
					value: "0-1-1",
					key: "0-1-1",
					children: [
						{
							title: "Cengkareng",
							value: "0-1-1-0",
							key: "0-1-1",
						},
						{
							title: "Grogol Petamburan",
							value: "0-1-1-1",
							key: "0-1-1",
						},
						{
							title: "Kalideres",
							value: "0-1-1-2",
							key: "0-1-1",
						},
					],
				},
				{
					title: "D.I. Yogyakarta",
					value: "0-1-2",
					key: "0-1-2",
				},
			],
		},
	];

	const onChange = (newValue: string[]) => {
		console.log("onChange ", newValue);
		// setValue(newValue);
	};

	const onChangeRadio = (e: RadioChangeEvent) => {
		console.log("radio checked", e.target.value);
		setValue(e.target.value);
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
						label='Audience Name'
						name='name'
						size='large'
						placeholder='Type Audience Name'
					/>
					<Form.Item label='Locations'>
						<TreeSelect
							className='w-full'
							size='large'
							onChange={onChange}
							treeData={treeData}
							showSearch
							treeCheckable
							showArrow
							suffixIcon=''
							placeholder='Search Province, City, District, Sub-district'
						/>
					</Form.Item>
					<Form.Item label='Gender'>
						<Radio.Group
							className='flex justify-between'
							onChange={onChangeRadio}
							value={value}>
							<Radio value={1}>All</Radio>
							<Radio value={2}>Male</Radio>
							<Radio value={3}>Female</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item label='Age'>
						<div className='flex items-center gap-4'>
							<Input name='ageMin' size='large' placeholder='Age Min' />
							<span>-</span>
							<Input name='ageMax' size='large' placeholder='Age Max' />
						</div>
					</Form.Item>
					<FormItem
						label='Platform'
						name='platform'
						placeholder='Select Platform'
						size='large'
						select>
						<Option value='Caption'>Platform 1</Option>
						<Option value='Placement 2'>Platform 2</Option>
						<Option value='Placement 3'>Platform 3</Option>
					</FormItem>

					<CustomButton
						text='Save Audience'
						className='mx-auto'
						onClick={() => console.log("CLICK")}
					/>
				</Form>
			</div>
		</DefaultLayout>
	);
};

export default AddAudience;
