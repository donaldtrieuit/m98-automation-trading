import React from 'react';
import { propsIconType } from '@assets/icons/types';

const InfoCycleIcon = ({ width = 17, height = 18, color = '#58667E' }: propsIconType) => {
	return (
		<svg
			className="svg-insider"
			width={width}
			height={height}
			viewBox="0 0 17 16"
			fill={color}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M5.20202 0H12.138C14.85 0 16.666 1.904 16.666 4.736V11.2728C16.666 14.0968 14.85 16 12.138 16H5.20202C2.49002 16 0.666016 14.0968 0.666016 11.2728V4.736C0.666016 1.904 2.49002 0 5.20202 0ZM8.65792 5.64883C8.28192 5.64883 7.96992 5.33603 7.96992 4.95283C7.96992 4.56083 8.28192 4.24883 8.67392 4.24883C9.05792 4.24883 9.36992 4.56083 9.36992 4.95283C9.36992 5.33603 9.05792 5.64883 8.65792 5.64883ZM9.36211 11.0248C9.36211 11.4088 9.05011 11.7208 8.65811 11.7208C8.27411 11.7208 7.96211 11.4088 7.96211 11.0248V7.48877C7.96211 7.10397 8.27411 6.78477 8.65811 6.78477C9.05011 6.78477 9.36211 7.10397 9.36211 7.48877V11.0248Z"
				fill={color}
			/>
		</svg>
	);
};

export { InfoCycleIcon };
