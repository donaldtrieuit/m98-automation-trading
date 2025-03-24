import React, { useMemo } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Exchange } from '@types';
import { useMediaQuery } from 'react-responsive';
import { useThemeContext } from '@providers/ThemeProvider';
import { EXPIRATION_EXCHANGE, handleGetExchangeLogo, MARKET_MODE, uppercaseFirstLetter } from '@utils';
import { DeleteIcon, InfoCycleIcon, PenIcon, WarningOutlineIcon } from '@assets/icons';
import { useNavigate } from 'react-router-dom';
import CustomPagination from '@components/pagination';

// Interfaces
interface Filter {
	offset: number;
	limit: number;
	name?: string;
	exchange_code?: string;
	mode?: string;
}

interface MyWalletsSliderProps extends WithTranslation {
	exchanges?: Exchange[];
	onEdit?: (exchangeId: number) => void;
	onDelete?: (exchangeId: number) => void;
	onChangeFilter: (updateFilter: Partial<Filter>) => void;
	filter: Filter;
	exchangesTotal: number;
	isDemoAccount: boolean;
}

const MyWalletsSlider: React.FC<MyWalletsSliderProps> = ({
	t,
	exchanges = [],
	onEdit,
	onDelete,
	onChangeFilter,
	filter,
	exchangesTotal,
	isDemoAccount,
}) => {
	const isMobile = useMediaQuery({ maxWidth: '768px' });
	const pageSize = useMemo<number>(() => filter?.limit || 0, [filter?.limit]);
	const { typeTheme } = useThemeContext();
	const navigate = useNavigate();

	const isDisableTrading = (exchange: Exchange): boolean => {
		const { mode, restrictions } = exchange;
		const { enableFutures, enableSpotAndMarginTrading } = restrictions || {};
		let isDisable = false;
		if (mode === MARKET_MODE.spot && !enableSpotAndMarginTrading) isDisable = true;
		if (mode === MARKET_MODE.future && !enableFutures) isDisable = true;
		if (isDemoAccount) isDisable = false;
		return isDisable;
	};

	const sortedExchanges = useMemo<Exchange[]>(
		() =>
			exchanges.sort((ex) =>
				ex.status === EXPIRATION_EXCHANGE.unauthenticated ||
				(ex.status === EXPIRATION_EXCHANGE.authenticated && isDisableTrading(ex))
					? -1
					: 1
			),
		[exchanges, isDemoAccount] // Added isDemoAccount due to its effect on isDisableTrading
	);

	const currentPage = useMemo<number>(() => Math.ceil(filter?.offset / pageSize) + 1, [filter, pageSize]);

	return (
		<div className="sywalletsslider-coustom">
			<div className="flex lg:grid lg:grid-cols-3 xl:grid-cols-4 overflow-x-scroll gap-6 hide-scrollbar p-1">
				{(!isMobile ? sortedExchanges.slice(0, pageSize) : exchanges).map((exchange) => (
					<div key={exchange.id} className="flex-[0_0_80vw] md:flex-[0_0_45vw]">
						<div className="items relative" data-qa="exchange-item">
							<div
								className={`wallet-card ${
									exchange.status === EXPIRATION_EXCHANGE.unauthenticated ||
									(exchange.status === EXPIRATION_EXCHANGE.authenticated &&
										isDisableTrading(exchange))
										? 'wallet-error'
										: ''
								}`}
							>
								<div className="flex justify-start">
									<Tooltip title={t('edit')}>
										<button
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												onEdit?.(exchange.id);
											}}
											data-qa="exchange-edit-button"
											disabled={isDemoAccount}
										>
											<PenIcon />
										</button>
									</Tooltip>
									<Tooltip title={t('info')}>
										<button
											className="ml-4"
											data-qa="exchange-detail-button"
											disabled={isDemoAccount}
											onClick={() => {
												navigate(`/exchanges/${exchange.id}`);
											}}
										>
											<InfoCycleIcon />
										</button>
									</Tooltip>
									<Tooltip title={t('delete')}>
										<button
											className="ml-4"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												onDelete?.(exchange.id);
											}}
											data-qa="exchange-delete-button"
											disabled={isDemoAccount}
										>
											<DeleteIcon />
										</button>
									</Tooltip>
								</div>
								<div className="head pt-2">
									<div className="flex items-center justify-between mb-2">
										<div>
											<Tooltip title={exchange.name}>
												<div
													className={`${
														typeTheme === 'dark' ? 'text-[#FFF]' : 'text-[#5D6589]'
													} text-[16px] limit-line font-semibold one-line`}
												>
													{exchange.name}
												</div>
											</Tooltip>
											<div className="text-gray-600 lg:text-md overflow-hidden whitespace-nowrap text-ellipsis text-[13px]">
												{`${
													exchange?.exchange !== 'bingx'
														? uppercaseFirstLetter(exchange?.exchange)
														: 'BingX'
												} - ${uppercaseFirstLetter(exchange?.mode)} ${
													exchange?.mode === MARKET_MODE.future ? 'USDT-M' : ''
												}`}
											</div>
										</div>
										<img
											className="w-[40px] mr-2 object-contain"
											src={handleGetExchangeLogo(exchange.exchange)}
											alt={exchange.exchange}
										/>
									</div>
									{!exchange.latest_updated ? (
										<div className="flex items-center">
											<span className="mr-4">${exchange.total_balance_to_usd}</span>
											<Tooltip title={t('balance_synchronizing_warning')}>
												<ExclamationCircleFilled className="text-[20px]" />
											</Tooltip>
										</div>
									) : (
										<span className="font-semibold text-[28px]">
											${exchange.total_balance_to_usd}
										</span>
									)}
								</div>
								{exchange.status === EXPIRATION_EXCHANGE.unauthenticated && (
									<div className="mt-4 flex items-center">
										<WarningOutlineIcon />
										<span className="text-red-01 ml-2 text-[11px]">{t('exchange_expired')}</span>
									</div>
								)}
								{exchange.status === EXPIRATION_EXCHANGE.authenticated &&
									isDisableTrading(exchange) && (
										<div className="mt-4 flex items-center">
											<WarningOutlineIcon />
											<span className="text-red-01 ml-2 text-[11px]">
												{exchange.mode === MARKET_MODE.spot
													? t('spot_exchange_disabled_trading')
													: t('future_exchange_disabled_trading')}
											</span>
										</div>
									)}
							</div>
						</div>
					</div>
				))}
			</div>
			<div className={`flex ${isMobile ? 'justify-center' : 'justify-between'} mt-4 m-auto`}>
				<CustomPagination
					total={exchangesTotal}
					currentPage={currentPage}
					pageSize={pageSize}
					showCounter
					onChange={(page: number) => {
						onChangeFilter({ ...filter, offset: (page - 1) * pageSize });
					}}
				/>
			</div>
		</div>
	);
};

export default withTranslation()(MyWalletsSlider);
