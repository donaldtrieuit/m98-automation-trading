import React from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonIconProps = {
	label?: string,
	className?: string,
	classNameLabel?: string,
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonPrimary: React.FC<ButtonIconProps> = ({ label, classNameLabel, className, ...props }) => {
	return (
		<button {...props} className={twMerge(className)}>
			{label && <span className={twMerge(classNameLabel)}>{label}</span>}
		</button>
	);
};

export { ButtonPrimary };
