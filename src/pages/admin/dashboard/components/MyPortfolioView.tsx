import React, { useState, useEffect, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button, Select, Tag } from 'antd';
import Pie from '@ant-design/plots/lib/components/pie';
import { measureTextWidth } from '@antv/g2plot/lib/utils/measure-text';
import { useTranslation, UseTranslationResponse } from 'react-i18next';
import FearAndGreedView from './FearAndGreedView';
import { handleGetExchangeLogo, uppercaseFirstLetter } from '@utils';
import RecentTransactions from './RecentTransactions';
import { renderStatistic } from '@utils';
import { Exchange } from '@types';
import { useStore } from '@providers/AppProvider';
import { useThemeContext } from '@providers/ThemeProvider';
import { mockExchanges, mockWalletData } from '@mockdata/exchanges';
import { SyncDataIcon } from '@assets/icons';
import { PieConfig } from '@ant-design/plots';
import { StatisticText } from '@antv/g2plot/src/types/statistic';
import { Tooltip } from '@ant-design/plots/es/interface';

interface ChartData {
	type: string;
	value: number;
	percent: number;
}

interface LegendItem {
	unchecked: boolean;
	value: number;
}

const PieMemo = memo(({ ...props }: PieConfig) => (
	<Pie
		{...props}
		onReady={(plot) => {
			plot.chart.removeInteraction('legend-filter');
		}}
	/>
));
PieMemo.displayName = 'PieMemo';

interface MyPortfolioViewProps {
	exchanges?: Exchange[];
}

const MyPortfolioView: React.FC<MyPortfolioViewProps> = ({ exchanges }) => {
	const { t }: UseTranslationResponse<'translation', undefined> = useTranslation();
	const { stateStore } = useStore();
	const [selectedExchange, setSelectedExchange] = useState<Exchange | undefined>(exchanges?.[0]);
	const [tokenChartData, setTokenChartData] = useState<ChartData[]>([]);
	const [legendItemPercentMap, setLegendItemPercentMap] = useState<Record<string, LegendItem>>({});
	const [reSyncingExchange, setReSyncingExchange] = useState<boolean>(false);
	const [totalBalance, setTotalBalance] = useState<string>('$0.0');
	const { typeTheme } = useThemeContext();

	const reSyncExchange = async (): Promise<Exchange | undefined> => {
		if (!selectedExchange) return undefined;
		getExchangeToken(selectedExchange.id);
		return selectedExchange;
	};

	const getExchangeToken = (exchangeId: number): void => {
		const exchange = mockExchanges.find((exchange) => exchange.id === exchangeId);
		if (exchange) {
			const results = mockWalletData.filter((token) => token.exchange === exchangeId);
			setSelectedExchange(exchange);
			const total = Math.max(
				exchange.total_balance_to_usd,
				results.reduce((t, { asset_usdt }) => t + parseFloat(String(asset_usdt)) || 0, 0)
			);
			const selectedTokens = results
				.filter(({ asset_usdt }) => asset_usdt / total > 0.01)
				.slice(0, 5)
				.map(({ symbol, asset_usdt }) => ({
					type: symbol,
					value: parseFloat(String(asset_usdt)) || 0,
					percent: Math.round((total ? (parseFloat(String(asset_usdt)) || 0) / total : 0) * 10000) / 100,
				}));

			const selectedTotal = selectedTokens.reduce((t, { value }) => t + value, 0);
			const selectedTotalPercent = selectedTokens.reduce((t, { percent }) => t + percent, 0);
			if (selectedTotal < total && 100 - selectedTotalPercent > 0.01) {
				selectedTokens.push({
					type: t('others').toUpperCase(),
					value: Math.floor((total - selectedTotal) * 100) / 100,
					percent: Math.round((100 - selectedTotalPercent) * 100) / 100,
				});
			}
			const totalBalanceChart = stateStore.getCurrency(
				Math.round(selectedTokens.reduce((result, { value }) => result + value, 0) * 100) / 100,
				exchange.exchange
			);
			setTotalBalance(totalBalanceChart);
			setTokenChartData(selectedTokens);
			setLegendItemPercentMap(
				selectedTokens.reduce(
					(result, { type, percent }) => ({
						...result,
						[type]: {
							unchecked: false,
							value: percent,
						},
					}),
					{} as Record<string, LegendItem>
				)
			);
		}
	};

	useEffect(() => {
		if (exchanges && exchanges.length > 0) {
			getExchangeToken(exchanges[0].id);
		}
	}, [exchanges]);

	const pieConfig: PieConfig = useMemo(
		() => ({
			theme: typeTheme,
			appendPadding: 0,
			data: tokenChartData,
			angleField: 'value',
			colorField: 'type',
			radius: 1,
			innerRadius: 0.74,
			legend: false,
			pieStyle: {
				lineWidth: 0,
			},
			label: false,
			interactions: [],
			statistic: {
				title: {
					offsetY: -4,
					customHtml: (container: HTMLElement, view: any, datum: ChartData | undefined) => {
						const { width, height } = container.getBoundingClientRect();
						const d = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);
						const text = datum ? datum.type : t('');
						return renderStatistic(d, text, {
							fontSize: 24,
						});
					},
				} as StatisticText,
				content: {
					style: {
						whiteSpace: 'pre-wrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					},
					customHtml: (container: HTMLElement) => {
						const { width, height } = container.getBoundingClientRect();
						const containerWidth = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);
						const text = '';
						let scale = 1;
						const style = {
							fontSize: 14,
							color:
								selectedExchange && selectedExchange?.portfolio_pnl_percent > 0
									? '#11CABE'
									: selectedExchange && selectedExchange?.portfolio_pnl_percent < 0
										? '#FA2256'
										: '',
						};
						const textWidth = measureTextWidth(text, style);
						if (containerWidth < textWidth) {
							scale = (containerWidth - 20) / textWidth;
						}
						const textStyleStr = `width:${containerWidth + 4}px;`;
						if (selectedExchange && selectedExchange?.portfolio_pnl_percent > 0) {
							return `<div style="display: flex;align-items:center;gap:5px;justify-content: space-between;font-size:${
								scale * style.fontSize
							}px;color:${style.color};line-height:${scale < 1 ? 1 : 'inherit'};">
                <svg width="9" height="15" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0.294948 4.92926C0.358068 5.04626 0.47809 5.1192 0.608632 5.1192H2.64136V9.13285C2.64136 9.33552 2.80202 9.5 2.99999 9.5C3.19795 9.5 3.35862 9.33552 3.35862 9.13285V5.1192H5.39134C5.52236 5.1192 5.64239 5.04626 5.70503 4.92926C5.76862 4.81227 5.76432 4.66932 5.69498 4.55624L3.30363 0.671335C3.23764 0.564618 3.12336 0.5 2.99999 0.5C2.87662 0.5 2.76233 0.564618 2.69635 0.671335L0.30499 4.55624C0.268649 4.61596 0.25 4.68401 0.25 4.75205C0.25 4.81276 0.265302 4.87395 0.294948 4.92926Z"
                    fill="#11CABE"
                  />
                </svg><p>${selectedExchange?.portfolio_pnl_percent}%</p></div>`;
						}
						if (selectedExchange && selectedExchange?.portfolio_pnl_percent < 0) {
							return `<div style="display:flex;align-items:center;gap:5px;justify-content: space-between;font-size:${
								scale * style.fontSize
							}px;color:${style.color};line-height:${scale < 1 ? 1 : 'inherit'};">
                <svg width="9" height="15" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5.70505 5.07074C5.64193 4.95374 5.52191 4.8808 5.39137 4.8808H3.35864V0.867147C3.35864 0.664482 3.19798 0.5 3.00001 0.5C2.80205 0.5 2.64138 0.664482 2.64138 0.867147V4.8808H0.608657C0.477637 4.8808 0.357615 4.95374 0.294974 5.07074C0.231377 5.18773 0.23568 5.33068 0.305016 5.44376L2.69637 9.32866C2.76236 9.43538 2.87664 9.5 3.00001 9.5C3.12338 9.5 3.23767 9.43538 3.30365 9.32866L5.69501 5.44376C5.73135 5.38404 5.75 5.31599 5.75 5.24795C5.75 5.18724 5.7347 5.12605 5.70505 5.07074Z"
                    fill="#FA2256"
                  />
                </svg>
                <p>${selectedExchange?.portfolio_pnl_percent}%</p></div>`;
						}
						return `<div style="display: flex;align-items:center;gap:5px;justify-content: center;${textStyleStr};font-size:${
							scale * style.fontSize
						}px;color:${style.color};line-height:${scale < 1 ? 1 : 'inherit'};">0%</div>`;
					},
				} as StatisticText,
			},
			tooltip: {
				showMarkers: false,
				formatter: (datum: ChartData) => ({
					name: datum.type,
					value: `${stateStore.getCurrency(datum.value, selectedExchange?.exchange || '')} (${
						legendItemPercentMap[datum.type].value
					}%)`,
				}),
			} as Tooltip,
		}),
		[tokenChartData, legendItemPercentMap, typeTheme]
	);

	return (
		<div>
			<div className="card-primary px-3">
				<h1 className="text-primary font-semibold text-[16px] leading-6">{t('Balance Usage')}</h1>
				<p className="text-secondary text-[12px] leading-4">{t('Calculated by latest activity')}</p>
				{exchanges && exchanges?.length > 0 && selectedExchange && (
					<div className="flex justify-between gap-2 w-full mt-4" data-qa="portfolio-exchange-select">
						<Select
							size="middle"
							disabled={reSyncingExchange}
							className="w-[85%] max-w-[85%]"
							value={String(selectedExchange?.name)}
							onChange={(value: string) => {
								const exchange = exchanges.find((exchange) => exchange.id === parseInt(value));
								setSelectedExchange(exchange);
								if (exchange) getExchangeToken(exchange.id);
							}}
							data-qa="bought-coin-bot-select"
							popupClassName="bought-coin-bot-select"
							showSearch
							filterOption={(input: string, option?: { name?: string }) =>
								option?.name?.toLowerCase().includes(input.toLowerCase()) || false
							}
							options={exchanges?.map(({ id, name, exchange, mode }) => ({
								value: id,
								name,
								label: (
									<div className="flex items-center">
										<img className="w-[18px] mr-2" src={handleGetExchangeLogo(exchange)} alt="" />
										<div className="overflow-hidden whitespace-nowrap text-ellipsis inline-block mr-2">
											{name}
										</div>
										<Tag>{uppercaseFirstLetter(mode)}</Tag>
									</div>
								),
							}))}
						/>
						<Button
							className="flex justify-center items-center button-primary-outline--default"
							onClick={() => {
								setReSyncingExchange(true);
								reSyncExchange().finally(() => setReSyncingExchange(false));
							}}
							data-qa="exchange-refresh-button"
							disabled={reSyncingExchange}
							icon={<SyncDataIcon className={` ${reSyncingExchange ? 'animate-spin' : ''}`} />}
						/>
					</div>
				)}
				<div className="my-5">{selectedExchange && <PieMemo {...pieConfig} height={150} />}</div>
				<div className="flex flex-col items-center">
					<p className="text-third text-[28px] font-semibold">{totalBalance}</p>
					<p className="text-secondary text-[14px]">{t('Balance Available')}</p>
				</div>
				<div className={`${exchanges && exchanges.length > 0 ? '' : 'hidden'}`}>
					<Link
						to={`/exchanges/${selectedExchange?.id}`}
						style={!selectedExchange ? { pointerEvents: 'none' } : undefined}
					>
						<Button
							className="w-full button-primary rounded-[12px] text-[16px] font-semibold mt-5 h-[52px]"
							type="primary"
							disabled={!selectedExchange}
						>
							{t('exchange_detail')}
						</Button>
					</Link>
				</div>
			</div>
			<RecentTransactions />
			<div className="card-primary mt-4 md:block hidden">
				<FearAndGreedView />
			</div>
		</div>
	);
};

export default memo(MyPortfolioView);
