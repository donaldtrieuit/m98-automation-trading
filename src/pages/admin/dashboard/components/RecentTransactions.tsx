import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { ArrowRightIcon } from '@assets//icons/ArrowRightIcon';
import { Transaction } from '@types';
import { mockTransactions } from '@mockdata/transactions';
import CoinImage from '@components/coin/CoinImage';
import { useResponsive } from '@hooks/useResponsive';

// No props for this component, so we use an empty interface
const RecentTransactions: React.FC = () => {
	const { t } = useTranslation();
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const { is2XLargeScreen } = useResponsive();

	useEffect(() => {
		setTransactions(mockTransactions.slice(0, 2));
	}, []);

	return (
		<div className="card-primary gap-4 mt-4 grid grid-cols-1">
			<div className="flex justify-between">
				<div className="flex flex-col p-[10px] w-100">
					<h1 className="text-primary text-[16px] font-semibold leading-6">{t('Recent Transaction')}</h1>
					<p className="text-secondary text-[14px] leading-5 mt-1">{t('Calculated by latest activity')}</p>
				</div>
			</div>
			<div className="grid grid-cols-1">
				<Divider className="m-0" />
				{transactions.map(({ coin, side, cost, created }, i) => (
					<div key={i}>
						<div className="flex justify-between py-4 space-x-[10px]">
							<div>
								<CoinImage symbol={coin.split('/')[0]} size={is2XLargeScreen ? 42 : 30} />
							</div>
							<div className="flex-1 space-y-2">
								<p
									className={`text-primary font-medium ${is2XLargeScreen ? 'text-[14px]' : 'text-[13px]'}`}
								>
									{coin}
								</p>
								<p
									className={`${side === 'SELL' ? 'text-red-01' : 'text-green-02'} ${is2XLargeScreen ? 'text-[14px]' : 'text-[13px]'}`}
								>
									{side}
								</p>
								<p className={`text-primary text-[12px]`}>{`${parseFloat(cost)} ${
									coin.split('/')[1] || 'USDT'
								}`}</p>
							</div>
							<div className={`text-secondary ${is2XLargeScreen ? 'text-[14px]' : 'text-[13px]'}`}>
								{dayjs.tz(parseInt(created) * 1000).format('DD/MM/YYYY')}
							</div>
						</div>
						<Divider className="m-0" />
					</div>
				))}
			</div>
			<div className="flex pt-3">
				<Link className="link-primary text-[14px] flex items-center" to="/spot-orders">
					{t('View All Transaction')}
					<span className="ml-2">
						<ArrowRightIcon />
					</span>
				</Link>
			</div>
		</div>
	);
};

export default memo(RecentTransactions);
