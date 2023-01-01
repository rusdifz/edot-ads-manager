import React from "react";
import { Tabs, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import CustomButton from "src/components/atoms/Button";
import Search from "src/components/atoms/Search";
import Icon from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const { TabPane } = Tabs;

const ImgSvg = () => (
	<svg
		width='24'
		height='24'
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'>
		<path
			d='M19 19H3V7C3 6.45 2.55 6 2 6C1.45 6 1 6.45 1 7V19C1 20.1 1.9 21 3 21H19C19.55 21 20 20.55 20 20C20 19.45 19.55 19 19 19Z'
			fill='white'
		/>
		<path
			d='M21 4H14L12.59 2.59C12.21 2.21 11.7 2 11.17 2H7C5.9 2 5.01 2.9 5.01 4L5 15C5 16.1 5.9 17 7 17H21C22.1 17 23 16.1 23 15V6C23 4.9 22.1 4 21 4ZM18 13H10C9.90714 13 9.81612 12.9741 9.73713 12.9253C9.65815 12.8765 9.59431 12.8067 9.55279 12.7236C9.51126 12.6406 9.49368 12.5476 9.50202 12.4551C9.51036 12.3626 9.54429 12.2743 9.6 12.2L10.98 10.37C11.18 10.1 11.58 10.1 11.78 10.37L13 12L15.22 9.03C15.42 8.76 15.82 8.76 16.02 9.03L18.4 12.2C18.4557 12.2743 18.4896 12.3626 18.498 12.4551C18.5063 12.5476 18.4887 12.6406 18.4472 12.7236C18.4057 12.8067 18.3419 12.8765 18.2629 12.9253C18.1839 12.9741 18.0929 13 18 13Z'
			fill='white'
		/>
	</svg>
);

const ImgIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={ImgSvg} {...props} />
);

const UploadContent: React.FC<Props> = ({ nextClick }) => {
	const [search, setSearch] = React.useState("");
	const [fileList, setFileList] = React.useState<UploadFile[]>([]);

	const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
		setFileList(newFileList);
	};

	const onPreview = async (file: UploadFile) => {
		let src = file.url as string;
		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj as RcFile);
				reader.onload = () => resolve(reader.result as string);
			});
		}
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow?.document.write(image.outerHTML);
	};

	return (
		<div className='mobile-wrapper'>
			<Tabs centered className='w-full px-10' tabBarGutter={80}>
				<TabPane tab={<div>Existing</div>} key='1' className='py-3 media'>
					<div className='w-full mb-10'>
						<Search
							value={search}
							placeholder='Search Media'
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<div className='flex flex-wrap gap-10'>
						<div className='text-center flex flex-col text-xs text-[#666666] cursor-pointer'>
							<img
								src='/img/default-media.png'
								className='w-20 mb-2 h-20 object-cover rounded-md'
								alt='media'
							/>
							img1.jpg
						</div>
						<div className='text-center flex flex-col text-xs text-[#666666] cursor-pointer active'>
							<img
								src='/img/default-media.png'
								className='w-20 mb-2 h-20 object-cover rounded-md'
								alt='media'
							/>
							img1.jpg
						</div>
						<div className='text-center flex flex-col text-xs text-[#666666] cursor-pointer'>
							<img
								src='/img/default-media.png'
								className='w-20 mb-2 h-20 object-cover rounded-md'
								alt='media'
							/>
							img1.jpg
						</div>
						<div className='text-center flex flex-col text-xs text-[#666666] cursor-pointer'>
							<img
								src='/img/default-media.png'
								className='w-20 mb-2 h-20 object-cover rounded-md'
								alt='media'
							/>
							img1.jpg
						</div>
						<div className='text-center flex flex-col text-xs text-[#666666] cursor-pointer'>
							<img
								src='/img/default-media.png'
								className='w-20 mb-2 h-20 object-cover rounded-md'
								alt='media'
							/>
							img1.jpg
						</div>
						<div className='text-center flex flex-col text-xs text-[#666666] cursor-pointer'>
							<img
								src='/img/default-media.png'
								className='w-20 mb-2 h-20 object-cover rounded-md'
								alt='media'
							/>
							img1.jpg
						</div>
						<div className='text-center flex flex-col text-xs text-[#666666] cursor-pointer'>
							<img
								src='/img/default-media.png'
								className='w-20 mb-2 h-20 object-cover rounded-md'
								alt='media'
							/>
							img1.jpg
						</div>
						<div className='text-center flex flex-col text-xs text-[#666666] cursor-pointer'>
							<img
								src='/img/default-media.png'
								className='w-20 mb-2 h-20 object-cover rounded-md'
								alt='media'
							/>
							img1.jpg
						</div>
					</div>

					<CustomButton
						text='Next'
						className='mx-auto mb-4 mt-20'
						onClick={nextClick}
						style={{ padding: "6px 72px" }}
					/>
				</TabPane>
				<TabPane tab={<div>Upload</div>} key='2' className='py-3'>
					<div className='media-upload'>
						<ImgCrop rotate>
							<Upload
								action='#'
								listType='picture-card'
								fileList={fileList}
								onChange={onChange}
								onPreview={onPreview}>
								{fileList.length < 1 && (
									<div className='flex gap-4 items-center text-white text-sm bg-[#2BBECB] rounded-3xl p-2 px-4'>
										<ImgIcon className='text-base' /> Browse
									</div>
								)}
							</Upload>
						</ImgCrop>
					</div>
					<CustomButton
						text='Next'
						className='mx-auto mb-4 mt-10'
						onClick={nextClick}
						style={{ padding: "6px 72px" }}
					/>
				</TabPane>
			</Tabs>
		</div>
	);
};

type Props = {
	nextClick?: () => void;
};

export default UploadContent;
