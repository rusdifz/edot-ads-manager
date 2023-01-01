import React from "react";
import DefaultLayout from "src/components/defaultLayout";
import PageHeader from "src/components/atoms/PageHeader";
import CustomButton from "src/components/atoms/Button";
import SelectMultiple from "src/components/organizes/Filter";
import UploadComponent from "./upload";
import { FormItem } from "src/components/molecules/FormItem";
import {
	Form,
	Select,
	Radio,
	TreeSelect,
	Input,
	Progress,
	Divider,
	Space,
	Tooltip,
	Popover,
	Checkbox,
	DatePicker,
} from "antd";
import Icon, { InfoCircleOutlined } from "@ant-design/icons";
import type { RadioChangeEvent } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const { Option } = Select;

const ImgSvg = () => (
	<svg
		width='25'
		height='25'
		viewBox='0 0 25 25'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'>
		<path
			d='M19.5 19.5H3.5V7.5C3.5 6.95 3.05 6.5 2.5 6.5C1.95 6.5 1.5 6.95 1.5 7.5V19.5C1.5 20.6 2.4 21.5 3.5 21.5H19.5C20.05 21.5 20.5 21.05 20.5 20.5C20.5 19.95 20.05 19.5 19.5 19.5Z'
			fill='#AAAAAA'
		/>
		<path
			d='M21.5 4.5H14.5L13.09 3.09C12.71 2.71 12.2 2.5 11.67 2.5H7.5C6.4 2.5 5.51 3.4 5.51 4.5L5.5 15.5C5.5 16.6 6.4 17.5 7.5 17.5H21.5C22.6 17.5 23.5 16.6 23.5 15.5V6.5C23.5 5.4 22.6 4.5 21.5 4.5ZM18.5 13.5H10.5C10.4071 13.5 10.3161 13.4741 10.2371 13.4253C10.1581 13.3765 10.0943 13.3067 10.0528 13.2236C10.0113 13.1406 9.99368 13.0476 10.002 12.9551C10.0104 12.8626 10.0443 12.7743 10.1 12.7L11.48 10.87C11.68 10.6 12.08 10.6 12.28 10.87L13.5 12.5L15.72 9.53C15.92 9.26 16.32 9.26 16.52 9.53L18.9 12.7C18.9557 12.7743 18.9896 12.8626 18.998 12.9551C19.0063 13.0476 18.9887 13.1406 18.9472 13.2236C18.9057 13.3067 18.8419 13.3765 18.7629 13.4253C18.6839 13.4741 18.5929 13.5 18.5 13.5Z'
			fill='#AAAAAA'
		/>
	</svg>
);

const ImgIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={ImgSvg} {...props} />
);

const AddCampaign: React.FC = () => {
	const [form] = Form.useForm();
	const [value, setValue] = React.useState(1);
	const [step, setStep] = React.useState(1);
	const [newMode, setNewMode] = React.useState(false);
	const [mediaMode, setMediaMode] = React.useState(false);
	const [placement, setPlacement] = React.useState([]);
	const [progress, setProgress] = React.useState(25);
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
	const options = [
		{
			value: "Banner 1080px",
			label: "Banner 1080px",
		},
		{
			value: "Ads 1920px",
			label: "Ads 1920px",
		},
		{
			value: "Ads 1920px",
			label: "Ads 1920px",
		},
		{
			value: "Ads 1920px",
			label: "Ads 1920px",
		},
		{
			value: "Ads 1920px",
			label: "Ads 1920px",
		},
	];

	const nextStep = () => {
		setStep(step + 1);
		setProgress(progress + 25);
	};

	const prevStep = () => {
		setStep(step - 1);
		setProgress(progress - 25);
	};

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

	const doCheck = (e: CheckboxChangeEvent) => {
		console.log(`checked = ${e.target.checked}`);
		setNewMode(e.target.checked);
	};

	const onHandleFilter = (items: any) => {
		setPlacement(items);
	};

	const nextMedia = () => {
		setMediaMode(!mediaMode);
	};

	return (
		<DefaultLayout header='Manage Ads'>
			<PageHeader
				title={mediaMode ? "Select Media" : "Create New Campaign"}
				withButton
				buttonText='Save Progress'
				onClick={() => setMediaMode(!mediaMode)}
			/>
			{mediaMode ? (
				<UploadComponent nextClick={nextMedia} />
			) : (
				<div className='mobile-payment'>
					<div className='w-2/4 mt-10'>
						<div className='text-center text-xs text-edot-main font-semibold'>
							Campaign
							<Progress percent={progress} showInfo={false} />
							{step} / 4
						</div>
						<Divider className='border-t-[4px] pb-5' />
						{step === 1 && (
							<Form
								form={form}
								className='mt-10'
								autoComplete='off'
								layout='vertical'
								onFinish={onFinish}>
								<FormItem
									label='Campaign Name'
									name='name'
									size='large'
									placeholder='Type Campaign Name'
								/>
								<Form.Item label='Campaign Objective'>
									<div className='pl-3'>
										<label>Awareness</label>
										<Radio.Group
											className='flex justify-between mt-2 mb-4'
											onChange={onChangeRadio}
											value={value}>
											<Space direction='vertical'>
												<Radio>
													<span className='flex items-center'>
														Brand Awareness
														<Popover
															className='ml-1'
															placement='right'
															content='Lorem ipsum dolor sit amet, lorem ipsum'
															trigger='hover'>
															<div className='flex items-center justify-center'>
																<InfoCircleOutlined />
															</div>
														</Popover>
													</span>
												</Radio>
												<Radio>
													<span className='flex items-center'>
														Reach
														<Popover
															className='ml-1'
															placement='right'
															content='Lorem ipsum dolor sit amet, lorem ipsum'
															trigger='hover'>
															<div className='flex items-center justify-center'>
																<InfoCircleOutlined />
															</div>
														</Popover>
													</span>
												</Radio>
											</Space>
										</Radio.Group>
									</div>
									<div className='pl-3'>
										<label>Consideration</label>
										<Radio.Group
											className='flex justify-between mt-2 mb-4'
											onChange={onChangeRadio}
											value={value}>
											<Space direction='vertical'>
												<Radio>
													<span className='flex items-center'>
														Traffic
														<Popover
															className='ml-1'
															placement='right'
															content='Lorem ipsum dolor sit amet, lorem ipsum'
															trigger='hover'>
															<div className='flex items-center justify-center'>
																<InfoCircleOutlined />
															</div>
														</Popover>
													</span>
												</Radio>
											</Space>
										</Radio.Group>
									</div>
									<div className='pl-3'>
										<label>Conversion</label>
										<Radio.Group
											className='flex justify-between mt-2 '
											onChange={onChangeRadio}
											value={value}>
											<Space direction='vertical'>
												<Radio>
													<span className='flex items-center'>
														Catalogue Sales
														<Popover
															className='ml-1'
															placement='right'
															content='Lorem ipsum dolor sit amet, lorem ipsum'
															trigger='hover'>
															<div className='flex items-center justify-center'>
																<InfoCircleOutlined />
															</div>
														</Popover>
													</span>
												</Radio>
												<Radio>
													<span className='flex items-center'>
														Store Traffic
														<Popover
															className='ml-1'
															placement='right'
															content='Lorem ipsum dolor sit amet, lorem ipsum'
															trigger='hover'>
															<div className='flex items-center justify-center'>
																<InfoCircleOutlined />
															</div>
														</Popover>
													</span>
												</Radio>
											</Space>
										</Radio.Group>
									</div>
								</Form.Item>
								<FormItem
									className='pb-6'
									label='Description'
									name='desc'
									placeholder='Type Description'
									size='large'
									textarea
								/>
								<CustomButton
									text='Next'
									className='mx-auto mb-4'
									onClick={nextStep}
									style={{ padding: "6px 72px" }}
								/>
							</Form>
						)}

						{step === 2 && (
							<Form
								form={form}
								className='mt-10'
								autoComplete='off'
								layout='vertical'
								onFinish={onFinish}>
								<FormItem
									label='Audience'
									name='audience'
									placeholder='Select Audience'
									size='large'
									select
									disabled={newMode}>
									<Option value='Caption'>Audience 1</Option>
									<Option value='Placement 2'>Audience 2</Option>
									<Option value='Placement 3'>Audience 3</Option>
								</FormItem>
								<Checkbox onChange={doCheck} className='mb-5' checked={newMode}>
									Add New Audience
								</Checkbox>
								{newMode && (
									<>
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
												<Input
													name='ageMin'
													size='large'
													placeholder='Age Min'
												/>
												<span>-</span>
												<Input
													name='ageMax'
													size='large'
													placeholder='Age Max'
												/>
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
									</>
								)}
								<CustomButton
									text='Next'
									className='mx-auto mb-4 mt-10'
									onClick={nextStep}
									style={{ padding: "6px 72px" }}
								/>
							</Form>
						)}

						{step === 3 && (
							<Form
								form={form}
								className='mt-10'
								autoComplete='off'
								layout='vertical'
								onFinish={onFinish}>
								<FormItem
									label='Content'
									name='content'
									placeholder='Select Content'
									size='large'
									select
									disabled={newMode}>
									<Option value='Caption'>Audience 1</Option>
									<Option value='Placement 2'>Audience 2</Option>
									<Option value='Placement 3'>Audience 3</Option>
								</FormItem>
								<Checkbox onChange={doCheck} className='mb-5' checked={newMode}>
									Add New Content
								</Checkbox>
								{newMode && (
									<>
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
												tagCount={10}
												options={options}
												defaultValue={placement}
												handleChange={onHandleFilter}
												size='large'
											/>
										</Form.Item>
										{placement.length !== 0 ? (
											<>
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
												<div className='flex flex-col text-lg font-semibold my-8'>
													<div className='flex gap-4 items-center mb-4'>
														<InfoCircleOutlined />
														<span className='text-sm text-[#888888]'>
															Placed in the homepage, size 1080 x 240 px,
															extension .jpg / .jpeg / .png
														</span>
													</div>
													<div className='img-wrapper mx-auto'>
														<img
															src='/img/banner-example.png'
															className='img-content'
															alt='banner-1080px'
														/>
													</div>
													<button
														type='button'
														className='upload-img'
														onClick={() => setMediaMode(!mediaMode)}>
														<ImgIcon className='text-base' />
														Choose Media
													</button>
												</div>
												<FormItem
													label='Link'
													name='link'
													size='large'
													placeholder='Link'
												/>
												<FormItem
													label='Category Name'
													name='category'
													size='large'
													placeholder='Category Name'
												/>
												<FormItem
													label='Cost per 10 hours'
													name='cost'
													size='large'
													placeholder='IDR 200'
												/>
												<FormItem
													label='Cost per 100 views'
													name='view'
													size='large'
													placeholder='IDR 500'
												/>
											</>
										) : (
											<>
												<div className='flex justify-between text-sm'>
													- <span>0/0</span>
												</div>
												<div className='text-center text-xs'>
													No Placement selected
												</div>
											</>
										)}
									</>
								)}
								<CustomButton
									text='Next'
									className='mx-auto mb-4 mt-10'
									onClick={nextStep}
									style={{ padding: "6px 72px" }}
								/>
							</Form>
						)}

						{step === 4 && (
							<Form
								form={form}
								autoComplete='off'
								layout='vertical'
								onFinish={onFinish}>
								<h4 className='text-xl mb-4'>Campaign ABC</h4>
								<div className='flex flex-col text-lg font-semibold mb-4'>
									<span className='text-sm text-[#888888]'>Objective</span>
									Brand Awareness
								</div>
								<div className='flex flex-col text-lg font-semibold mb-4'>
									<span className='text-sm text-[#888888]'>Audience</span>
									Audience 1
								</div>
								<div className='flex flex-col text-lg font-semibold mb-4'>
									<span className='text-sm text-[#888888]'>Location</span>
									DKI Jakarta, Bandung, Tangerang
								</div>
								<div className='flex flex-col text-lg font-semibold mb-4'>
									<span className='text-sm text-[#888888]'>Gender</span>
									All
								</div>
								<div className='flex flex-col text-lg font-semibold mb-4'>
									<span className='text-sm text-[#888888]'>Age</span>
									25-31
								</div>
								<div className='flex flex-col text-lg font-semibold mb-4'>
									<span className='text-sm text-[#888888]'>Interest</span>
									Lorem Ipsum
								</div>
								<div className='flex flex-col text-lg font-semibold mb-4'>
									<span className='text-sm text-[#888888]'>Description</span>
									Lorem Ipsum
								</div>
								<div className='flex flex-col text-lg font-semibold mb-4'>
									<span className='text-sm text-[#888888]'>Content Name</span>
									Banner e-shop
								</div>
								<div className='flex flex-col text-lg font-semibold mb-4'>
									<span className='text-sm text-[#888888]'>Placement</span>
									Banner 1080px, Caption,
								</div>
								<div className='flex flex-col text-lg font-semibold mb-4'>
									<span className='text-sm text-[#888888]'>
										Scheduled (Published Date - End Date)
									</span>
									02/09/2022 - Continuous
								</div>
								<div className='flex flex-col text-lg font-semibold mb-8'>
									<span className='text-sm text-[#888888]'>Budget Limit</span>
									IDR {Intl.NumberFormat("id").format(500000)}
								</div>
								<hr className='w-full h-1 bg-[#f4f4f4]' />
								<div className='flex flex-col text-lg font-semibold my-8'>
									<span className='text-sm text-[#888888]'>Placement 1</span>
									Banner 1080px
									<div className='img-wrapper'>
										<img
											src='/img/banner-example.png'
											className='img-content'
											alt='banner-1080px'
										/>
									</div>
								</div>
								<hr className='w-full h-1 bg-[#f4f4f4]' />
								<div className='flex flex-col text-lg font-semibold mt-8 mb-4'>
									<span className='text-sm text-[#888888]'>Placement 2</span>
									Caption
									<div className='note mt-4'>
										Lorem ipsum caption Lorem ipsum caption Lorem ipsum caption
									</div>
								</div>
								<Form.Item label='Schedule' className='mb-4'>
									<Radio.Group onChange={onChangeRadio} value={value}>
										<Radio>Continuous</Radio>
										<Radio>End Date</Radio>
									</Radio.Group>
								</Form.Item>
								<Form.Item>
									<DatePicker
										placeholder='DD/MM/YYYY'
										className='w-full'
										size='large'
									/>
								</Form.Item>
								<Form.Item label='Budget Limit' className='mb-4'>
									<Radio.Group onChange={onChangeRadio} value={value}>
										<Radio>No Limit</Radio>
										<Radio>Budget Limit</Radio>
									</Radio.Group>
								</Form.Item>
								<FormItem
									name='budged'
									size='large'
									placeholder='IDR 100.000'
								/>

								<CustomButton
									text='Publish'
									className='mx-auto mb-4 mt-10'
									onClick={nextStep}
									style={{ padding: "6px 72px" }}
								/>
							</Form>
						)}
					</div>
				</div>
			)}
		</DefaultLayout>
	);
};

export default AddCampaign;
