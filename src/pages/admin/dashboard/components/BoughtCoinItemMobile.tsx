import React from 'react';
import { Button } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import CoinIcon from '@components/coin/CoinImage';
import { useStore } from '@providers/AppProvider';
import { BoughtCoin } from '@types';

// Interface for props
interface BoughtCoinItemMobileProps extends WithTranslation {
	className?: string;
	boughtCoin: BoughtCoin;
	disableSell?: boolean;
	onSell?: () => void;
	onOpenTradingView: (symbol: string, exchange_code: string, exchange_mode: string) => void;
	loading?: boolean;
}

const BoughtCoinItemMobile: React.FC<BoughtCoinItemMobileProps> = ({
	t,
	className,
	boughtCoin,
	disableSell = false,
	onSell,
	onOpenTradingView,
	loading,
}) => {
	const { stateStore } = useStore();
	const { symbol, exchange_code, exchange_mode } = boughtCoin;

	return (
		<div className={className}>
			<div className="flex justify-between items-center">
				<div className="flex" onClick={() => onOpenTradingView(symbol, exchange_code, exchange_mode)}>
					<div>
						<CoinIcon
							className="flex-[0_0_24px]"
							symbol={boughtCoin.symbol.replace('USDT', '').split('/')?.[0] || ''}
							size={24}
							showAlt={false}
						/>
					</div>
					<span className="text-[14px] text-primary font-medium ml-2">{boughtCoin.symbol}</span>
				</div>
				<Button
					type="primary"
					className="button-primary--danger"
					onClick={() => onSell?.()}
					disabled={disableSell}
					loading={loading}
				>
					{t('sell')}
				</Button>
			</div>
			<div className="flex justify-between">
				<p className="text-secondary">{`${t('bot')}`}</p>
				<p className="text-right">{boughtCoin.bot_name}</p>
			</div>
			<div className="flex justify-between">
				<p className="text-secondary">{`${t('profit')}`}</p>
				<p>
					<span className="ms-auto fs-15 mb-0 font-w600">
						{stateStore.getCurrency(boughtCoin.pnl, boughtCoin.exchange_code)}
					</span>{' '}
					<span
						className={`ms-auto ${
							boughtCoin.pnl_percent > 0
								? 'text-green-02'
								: boughtCoin.pnl_percent < 0
									? 'text-red-01'
									: 'opacity-80'
						}`}
					>
						{`(${boughtCoin.pnl_percent}%)`}
					</span>
				</p>
			</div>
			<div className="flex justify-between">
				<p className="text-secondary">{`${t('volume')}`}</p>
				<p>{parseFloat(boughtCoin.volume)}</p>
			</div>
			<div className="flex justify-between">
				<p className="text-secondary">{`${t('bought_at')}`}</p>
				<p>{parseFloat(boughtCoin.bought_at)}</p>
			</div>
			<div className="flex justify-between">
				<p className="text-secondary">{`${t('time')}`}</p>
				<p>{dayjs.tz(parseInt(boughtCoin.timestamp) * 1000).format('DD/MM/YYYY HH:mm:ss')}</p>
			</div>
		</div>
	);
};

export default withTranslation()(BoughtCoinItemMobile);
