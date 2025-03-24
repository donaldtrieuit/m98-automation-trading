import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import React from 'react';

const MainLayout: React.FC = () => {
	return (
		<div className="overflow-auto">
			<Layout>
				<Outlet />
			</Layout>
		</div>
	);
};

export default MainLayout;
