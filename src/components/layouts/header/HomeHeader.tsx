import React from 'react';
import { Layout } from 'antd';
const { Header } = Layout;

const HomeHeader = () => {
	return (
		<Header className="flex justify-between items-center">
			<p className="text-3xl font-semibold whitespace-nowrap">Million 98</p>
		</Header>
	);
};

export default HomeHeader;
