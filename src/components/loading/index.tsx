import React from 'react';
import { Spin, SpinProps } from 'antd';

interface LoadingProps extends SpinProps {
	className?: string;
}

const Loading: React.FC<LoadingProps> = ({ className, ...props }) => (
	<Spin wrapperClassName={className} spinning={true} {...props} />
);

export default Loading;
