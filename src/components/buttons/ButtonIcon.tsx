import React from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonIconProps = {
	icon: React.ReactNode,
	label?: string,
	className?: string,
	classNameLabel?: string,
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonIconCore: React.FC<ButtonIconProps> = ({ icon, label, classNameLabel, className, ...props }) => {
	return (
		<button {...props} className={twMerge(className)}>
			{icon}
			{label && <span className={twMerge(classNameLabel)}>{label}</span>}
		</button>
	);
};

export { ButtonIconCore };
