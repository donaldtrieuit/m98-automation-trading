import React, { useMemo } from 'react';
import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import OrderHistory from './components/OrderHistoryTab';

// Define the type for tab items based on Ant Design's Tabs
interface TabItem {
	key: string;
	label: React.ReactNode;
	children: React.ReactNode;
}

const Transactions: React.FC = () => {
	const { t } = useTranslation();

	const { search } = useLocation();
	const queryParams = useMemo<URLSearchParams>(() => new URLSearchParams(search), [search]);

	const tabItems = useMemo<TabItem[]>(
		() => [
			{
				key: 'spotOrderHistory',
				label: <span>{t('Order History')}</span>,
				children: <OrderHistory />,
			},
		],
		[t]
	);

	return (
		<div className="card-primary mx-4 md:mx-8">
			<Tabs
				activeKey={queryParams.get('type') || 'spotOrderHistory'}
				defaultActiveKey="spotOrderHistory"
				items={tabItems}
			/>
		</div>
	);
};

export default Transactions;
