import React from 'react';

type AlertInfoProps = {
	icon: React.ReactNode,
	message?: string,
	showIcon?: boolean,
	className?: string,
	classNameLabel?: string,
};

const AlertInfo = ({ className, classNameLabel, message, showIcon, icon }: AlertInfoProps) => {
	return (
		<div className={`flex flex-row items-center rounded-[10px] bg-[#89C5CC45] p-4 gap-2 ${className} w-fit`}>
			{showIcon && icon}
			<span className={`${classNameLabel} text-[#366890] font-medium text-[20px] leading-normal`}>{message}</span>
		</div>
	);
};

export default AlertInfo;
