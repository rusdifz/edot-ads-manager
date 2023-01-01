import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Radio, Typography, Collapse, Modal } from "antd";
import DefaultLayout from "src/components/defaultLayout";
import CustomButton from "src/components/atoms/Button";
import PageHeader from "src/components/atoms/PageHeader";
import PinInput from "react-pin-input";
import {
	PlusOutlined,
	CopyOutlined,
	CheckOutlined,
	ArrowRightOutlined,
	CloseOutlined,
} from "@ant-design/icons";
import BniLogo from "src/assets/img/bni.png";
import BriLogo from "src/assets/img/briva.png";
import GopayLogo from "src/assets/img/gopay.png";
import GopayBigLogo from "src/assets/img/gopay-big.png";
import PermataLogo from "src/assets/img/permata.png";
import OvoLogo from "src/assets/img/ovo.png";
import OvoBigLogo from "src/assets/img/ovo-big.png";
import SuccessLogo from "src/assets/img/payment-complete.png";
import type { RadioChangeEvent } from "antd";

const { Paragraph } = Typography;
const { Panel } = Collapse;

const Topup: React.FC = () => {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [formData, setFormData] = React.useState({
		amount: "0",
		payment: "",
	});
	const [payout, setPayout] = React.useState(false);
	const [success, setSuccess] = React.useState(false);

	const numberOnly = (event: any) => {
		const val = event.target.value.replaceAll(".", "");
		if (event.target.validity.valid && val.length < 16) {
			const number = Intl.NumberFormat("id-ID").format(Number(val ?? 0));
			form.setFieldsValue({ amount: String(number) });
			setFormData((prev) => ({ ...prev, amount: String(number) }));

			return;
		}

		form.setFieldsValue({ amount: formData.amount });
	};

	const onFinish = (values: any) => {
		console.log("Success:", values);
	};

	const onHandleChange = (e: RadioChangeEvent) => {
		console.log("radio checked", e.target.value);
		setFormData((prev) => ({ ...prev, payment: e.target.value }));
	};

	const onHandlePin = (value: React.ReactNode, index: React.ReactNode) => {
		console.log(value);
		console.log(index);
	};

	const onComplete = (value: React.ReactNode) => {
		console.log("onComplete", value);
	};

	return (
		<DefaultLayout header='Ads Wallet'>
			<PageHeader title={payout ? "Complete Payment" : "Top up Wallet"} />
			<div className='mobile-payment'>
				{payout ? (
					<div className='flex flex-col w-2/4 mt-10'>
						<div className='flex justify-between mb-5 text-lg'>
							<h2>Total Payment</h2>
							<span className='text-edot-primary'>
								Rp {Intl.NumberFormat("id").format(500000)}
							</span>
						</div>
						{formData.payment !== "gopay" && formData.payment !== "ovo" && (
							<div className='alert-warning mb-5'>
								Pay before August 2, 2020, 21:00 WIB
								<div>
									Time Remaining:
									<span className='font-extrabold'>23:59:00</span>
								</div>
							</div>
						)}
						<div className='border-b-[4px]' />
						{formData.payment !== "gopay" && formData.payment !== "ovo" && (
							<div className='mt-5 text-lg mb-4'>
								Mandiri Virtual Account
								<Paragraph
									className='mt-3 flex justify-between'
									copyable={{
										icon: [
											<div
												key='copy-icon'
												className='flex items-center text-edot-primary text-sm'>
												Copy <CopyOutlined className='ml-2' />
											</div>,
											<div
												key='copied-icon'
												className='flex items-center text-edot-primary text-sm'>
												Copy
												<CheckOutlined
													className='ml-2'
													style={{ color: "#52c41a" }}
												/>
											</div>,
										],
										tooltips: false,
									}}>
									8890828774335428
								</Paragraph>
							</div>
						)}
						{formData.payment === "ovo" && (
							<div className='my-10 flex flex-col justify-center text-center px-10'>
								<img
									src={OvoBigLogo}
									alt='ovo-big'
									className='object-contain mb-3 max-h-40'
								/>
								Input your registered phone number in OVO
								<div
									className='text-edot-primary p-2 text-center mt-2 text-lg'
									style={{ backgroundColor: "#FDE6F3" }}>
									0812345678910
								</div>
							</div>
						)}
						{formData.payment === "gopay" && (
							<div className='my-10 flex flex-col justify-center text-center px-10'>
								<img
									src={GopayBigLogo}
									alt='gopay-big'
									className='object-contain max-h-40'
								/>
								Input your Gopay PIN
								<div
									className='p-2 text-center mt-2 text-lg w-[32rem] mx-auto flex'
									style={{ backgroundColor: "#FDE6F3" }}>
									<PinInput
										length={6}
										initialValue=''
										secret
										focus
										onChange={onHandlePin}
										type='numeric'
										inputMode='number'
										style={{ padding: "8px" }}
										inputStyle={{ border: "none", color: "#EB008B" }}
										inputFocusStyle={{ borderColor: "#EB008B" }}
										onComplete={onComplete}
										autoSelect={true}
										regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
									/>
								</div>
							</div>
						)}

						{formData.payment !== "gopay" && <div className='border-b-[4px]' />}
						{formData.payment !== "gopay" && (
							<div className='mt-5 mb-8 '>
								<h2 className='mb-5 text-lg'>How to Pay</h2>
								{formData.payment !== "gopay" && formData.payment !== "ovo" && (
									<Collapse defaultActiveKey={["1"]}>
										<Panel header='ATM Mandiri' key='1'>
											<ol className='list-decimal'>
												<li>Lorem ipsum dolor sit amet</li>
												<li>Lorem ipsum dolor sit amet</li>
												<li>Lorem ipsum dolor sit amet</li>
											</ol>
										</Panel>
										<Panel header='Internet Banking Mandiri' key='2'>
											<ol className='list-decimal'>
												<li>Lorem ipsum dolor sit amet</li>
												<li>Lorem ipsum dolor sit amet</li>
												<li>Lorem ipsum dolor sit amet</li>
											</ol>
										</Panel>
										<Panel header='Mobile Banking Mandiri' key='3'>
											<ol className='list-decimal'>
												<li>Lorem ipsum dolor sit amet</li>
												<li>Lorem ipsum dolor sit amet</li>
												<li>Lorem ipsum dolor sit amet</li>
											</ol>
										</Panel>
									</Collapse>
								)}
								{formData.payment === "ovo" && (
									<ol className='list-decimal text-sm px-4 font-normal'>
										<li className='mb-3'>
											Open your OVO apps, go to notifications to complete your
											payment.
										</li>
										<li>
											Please make payment within 60 seconds before the payment
											is cancelled automatically.
										</li>
									</ol>
								)}
							</div>
						)}
						<div className='mb-3'>
							{formData.payment !== "gopay" && formData.payment !== "ovo" && (
								<Link
									to='#'
									className='text-edot-primary hover:text-edot-primary text-base flex items-center justify-center'
									onClick={() => setPayout(!payout)}>
									Back to Dashboard <ArrowRightOutlined className='ml-2' />
								</Link>
							)}
							{(formData.payment === "gopay" || formData.payment === "ovo") && (
								<div className='flex justify-center'>
									<CustomButton
										text='Send'
										className='mx-auto'
										style={{ padding: "6px 42px" }}
										onClick={() => {
											setPayout(!payout);
											setSuccess(!success);
										}}
									/>
								</div>
							)}
						</div>
					</div>
				) : (
					<Form
						form={form}
						initialValues={formData}
						className='w-2/4'
						autoComplete='off'
						layout='vertical'
						onFinish={onFinish}>
						<Form.Item
							label='Input Amount'
							name='amount'
							className='mb-2'
							required>
							<Input
								pattern='[0-9._,\b]*'
								className='top-up text-lg text-edot-primary justify-between py-2 px-4 rounded-full'
								prefix={"Rp"}
								onChange={numberOnly}
								style={{ backgroundColor: "#FDE6F3" }}
							/>
						</Form.Item>
						<div className='text-sm text-edot-primary text-right mx-4'>
							Min. Top Up Amount Rp 10.000
						</div>
						<div className='text-center text-lg mt-6'>
							<p>Select Payment Method</p>
						</div>
						<Form.Item name='payment' label='Virtual Account'>
							<Radio.Group
								className='flex flex-wrap justify-between'
								onChange={onHandleChange}>
								<Radio
									value='bni'
									className='w-[47%] flex items-center border border-gray-200 rounded-md p-4 mb-4 text-xs'>
									<img src={BniLogo} alt='logo-bni' className='icon-bank' />
									BNI Virtual Account
								</Radio>
								<Radio
									value='bri'
									className='w-[47%] flex items-center border border-gray-200 rounded-md p-4 mb-4 text-xs'>
									<img src={BriLogo} alt='logo-bni' className='icon-bank' />
									BRI Virtual Account
								</Radio>
								<Radio
									value='permata'
									className='w-[47%] flex items-center border border-gray-200 rounded-md p-4 mb-4 text-xs'>
									<img src={PermataLogo} alt='logo-bni' className='icon-bank' />
									Permata Virtual Account
								</Radio>
								<Radio
									value='mandiri'
									className='w-[47%] flex items-center border border-gray-200 rounded-md p-4 mb-4 text-xs'>
									<img src={PermataLogo} alt='logo-bni' className='icon-bank' />
									Mandiri Virtual Account
								</Radio>
							</Radio.Group>
						</Form.Item>
						<Form.Item name='payment' label='Instant Payment'>
							<Radio.Group
								className='flex flex-wrap justify-between'
								onChange={onHandleChange}>
								<Radio
									value='gopay'
									className='w-[47%] flex items-center border border-gray-200 rounded-md p-4 mb-4 text-xs'>
									<img src={GopayLogo} alt='logo-bni' className='icon-bank' />
									Gopay
								</Radio>
								<Radio
									value='ovo'
									className='w-[47%] flex items-center border border-gray-200 rounded-md p-4 mb-4 text-xs'>
									<img src={OvoLogo} alt='logo-bni' className='icon-bank' />
									OVO
								</Radio>
							</Radio.Group>
						</Form.Item>
						<div className='pt-6'>
							<CustomButton
								text='Pay Now'
								className='mx-auto'
								style={{ padding: "6px 42px" }}
								onClick={() => setPayout(!payout)}
							/>
						</div>
					</Form>
				)}
				<Modal
					visible={success}
					className='modal-payment-success'
					onCancel={() => setSuccess(!success)}
					width={270}
					closable={false}
					footer={null}
					centered>
					<div className='text-right'>
						<button type='button' onClick={() => setSuccess(!success)}>
							<CloseOutlined className='text-edot-primary' />
						</button>
					</div>
					<div className='flex items-center flex-col mt-2 pb-32'>
						<h2 className='text-lg text-edot-primary mb-10'>
							Payment Complete
						</h2>
						<img
							height={120}
							src={SuccessLogo}
							alt='payment-success'
							className='object-contain mb-3'
						/>
						<h4 className='text-xs font-normal text-white'>Transaction ID</h4>
						<span className='text-sm text-white'>#123423213</span>
					</div>
				</Modal>
			</div>
		</DefaultLayout>
	);
};

export default Topup;
