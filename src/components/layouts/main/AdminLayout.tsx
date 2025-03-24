import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import React from 'react';
import MainSider from '@components/layouts/sider';
import { Content } from 'antd/es/layout/layout';
import AdminHeader from '@components/layouts/header/AdminHeader';
import { useMediaQuery } from 'react-responsive';

const AdminLayout: React.FC = () => {
	const isLGBigger = useMediaQuery({ minWidth: '1024px' });

	return (
		<Layout>
			<MainSider />
			<Content>
				<Layout className="relative min-h-screen">
					<AdminHeader />
					<Content className={`${isLGBigger ? 'mt-8' : 'mt-4'} mb-20`}>
						<Outlet />
					</Content>
				</Layout>
			</Content>
		</Layout>
	);
};

export default AdminLayout;
