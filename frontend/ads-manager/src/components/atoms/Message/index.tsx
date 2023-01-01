import { message, Button } from "antd";

type Props = {
	type?: "success" | "warning" | "info" | "error" | "loading";
	onUndo?: () => void;
	undoButton?: boolean;
	text?: string;
	duration?: number;
};

export const Message = ({
	text,
	type = "info",
	onUndo,
	undoButton,
	duration = 3,
}: Props) => {
	message?.[type]({
		content: (
			<div className='w-full flex items-center justify-between text-sm leading-[auto] text-white'>
				{text}
				{undoButton && (
					<Button
						className='text-xs text-white ml-10 hover:text-white'
						type='link'
						size='small'
						onClick={onUndo}>
						<span className='underline hover:no-underline'>UNDO</span>
					</Button>
				)}
			</div>
		),
		duration,
	});
};
