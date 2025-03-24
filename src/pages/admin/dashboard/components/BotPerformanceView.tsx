import React, { useState, useEffect } from 'react';
import { Button, Select, Tooltip, Radio } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import BotPerformanceChart from './BotPerformanceChart';
import { useThemeContext } from '@providers/ThemeProvider';
import { useMediaQuery } from 'react-responsive';
import { Bot } from '@types';
import { getDateFromWeek, handleGetExchangeLogo } from '@utils';
import { useNavigate } from 'react-router-dom';
import Loading from '@components/loading';
import { mockDailyProfitData, mockMonthlyProfitData, mockWeeklyProfitData } from '@mockdata/bots';
import { NoDataYetIcon } from '@assets/icons';

interface PerformanceData {
	avg_profit: number;
	avg_est: number;
}

interface PeriodOption {
	label: string;
	value: 'daily' | 'weekly' | 'monthly';
}

interface BotPerformanceViewProps {
	className?: string;
	bots: Bot[];
	period: string;
	[key: string]: any;
}

// Constants
const PERIOD: PeriodOption[] = [
	{ label: '1D', value: 'daily' },
	{ label: '1W', value: 'weekly' },
	{ label: '1M', value: 'monthly' },
];

const BotPerformanceView: React.FC<BotPerformanceViewProps> = ({ className, bots, period, ...props }) => {
	const { t } = useTranslation();
	const { typeTheme } = useThemeContext();
	const navigate = useNavigate();
	const [selectedBot, setSelectedBot] = useState<Bot | undefined>(undefined);
	const [dailyData, setDailyData] = useState<PerformanceData[]>([]);
	const [weeklyData, setWeeklyData] = useState<PerformanceData[]>([]);
	const [monthlyData, setMonthlyData] = useState<PerformanceData[]>([]);
	const [dailyLabels, setDailyLabels] = useState<string[]>([]);
	const [weeklyLabels, setWeeklyLabels] = useState<string[]>([]);
	const [monthlyLabels, setMonthlyLabels] = useState<string[]>([]);
	const [currentPeriod, setCurrentPeriod] = useState<'daily' | 'weekly' | 'monthly'>(
		period.toLowerCase() as 'daily' | 'weekly' | 'monthly'
	);
	const [currentInput, setCurrentInput] = useState<'profit' | 'est'>('profit');
	const isMobile = useMediaQuery({ maxWidth: '768px' });
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (bots && bots.length > 0) {
			setLoading(false);
			setSelectedBot(bots[0]);
		}
	}, [bots]);

	const fetchDailyChart = (): void => {
		if (!selectedBot) return;
		let tmps = mockDailyProfitData;
		if (tmps.length === 1) {
			const m: Dayjs = dayjs(`${tmps[0].year}-${tmps[0].month}-${tmps[0].day}`).tz().add(-1, 'day');
			tmps = [
				{
					avg_est: 0,
					avg_profit: 0,
					day: m.date(),
					month: m.month() + 1,
					year: m.year(),
				},
				...mockDailyProfitData,
			];
		}
		setDailyData(tmps.map(({ avg_profit, avg_est }) => ({ avg_profit, avg_est })));
		setDailyLabels(tmps.map(({ day, month, year }) => `${year}/${month}/${day}`));
	};

	const fetchWeeklyChart = (): void => {
		if (!selectedBot) return;
		let tmpsWeek = mockWeeklyProfitData.reverse();
		if (tmpsWeek.length === 1) {
			const m: Dayjs = dayjs.tz().year(tmpsWeek[0].year).week(tmpsWeek[0].week).add(-1, 'week');
			tmpsWeek = [{ avg_est: 0, avg_profit: 0, week: m.week(), year: m.year() }, ...mockWeeklyProfitData];
		}

		setWeeklyData(tmpsWeek.map(({ avg_profit, avg_est }) => ({ avg_profit, avg_est })));
		setWeeklyLabels(tmpsWeek.map(({ week, year }) => getDateFromWeek(year, week)));
	};

	const fetchMonthlyChart = (): void => {
		if (!selectedBot) return;
		let tmpsMonth = mockMonthlyProfitData.reverse();
		if (tmpsMonth.length === 1) {
			const m: Dayjs = dayjs.tz().add(-1, 'month');
			tmpsMonth = [{ avg_est: 0, avg_profit: 0, month: m.month() + 1, year: m.year() }, ...mockMonthlyProfitData];
		}
		setMonthlyData(tmpsMonth.map(({ avg_profit, avg_est }) => ({ avg_profit, avg_est })));
		setMonthlyLabels(tmpsMonth.map(({ month, year }) => `${year}/${month}/01`));
	};

	const fetchDataChart = (currentPeriod: 'daily' | 'weekly' | 'monthly'): void => {
		switch (currentPeriod) {
			case 'weekly':
				fetchWeeklyChart();
				break;
			case 'monthly':
				fetchMonthlyChart();
				break;
			default:
				fetchDailyChart();
				break;
		}
	};

	useEffect(() => {
		if (selectedBot) {
			setLoading(true);
			fetchDataChart(currentPeriod);
			setLoading(false);
		}
	}, [selectedBot, currentPeriod]);

	const getData = (period: 'daily' | 'weekly' | 'monthly'): PerformanceData[] => {
		switch (period) {
			case 'daily':
				return dailyData;
			case 'weekly':
				return weeklyData;
			default:
				return monthlyData;
		}
	};

	const getLabels = (period: 'daily' | 'weekly' | 'monthly'): string[] => {
		switch (period) {
			case 'daily':
				return dailyLabels;
			case 'weekly':
				return weeklyLabels;
			default:
				return monthlyLabels;
		}
	};

	return (
		<div className={`flex flex-col card overflow-hidden relative ${className}`} {...props}>
			{bots?.length > 0 && (
				<div className="flex justify-between items-center">
					<div className="flex flex-row">
						<Select
							className={`${isMobile ? 'min-w-[150px]' : 'min-w-[250px]'} mr-1`}
							value={String(selectedBot?.name)}
							onChange={(value: string) => {
								setSelectedBot(bots.find((bot) => bot.id === parseInt(value)));
							}}
							data-qa="performance-bot-select"
							popupClassName="bought-coin-bot-select md:min-w-[400px]"
							showSearch
							filterOption={(input: string, option?: { children?: string }) =>
								option?.children?.toLowerCase().includes(input.toLowerCase()) || false
							}
							options={bots.map((bot) => ({
								value: bot.id,
								children: bot.name,
								label: (
									<Tooltip
										color={typeTheme === 'dark' ? '#1E1F25' : '#FFFFFF'}
										title={bot.name}
										trigger={['hover']}
										placement="topLeft"
										open={bot.name?.length < 50 ? false : undefined}
									>
										<div className="flex items-center gap-2">
											<img
												className="w-[18px]"
												src={handleGetExchangeLogo(bot.my_exchange.exchange_code)}
												alt=""
											/>
											{bot.name}
										</div>
									</Tooltip>
								),
							}))}
						/>

						<Select
							className="min-w-[70px]"
							defaultValue="profit"
							onChange={(value: 'profit' | 'est') => setCurrentInput(value)}
							data-qa="performance-bot-select-currency"
							popupClassName="bought-coin-bot-select"
							options={[
								{ label: 'PNL (%)', value: 'profit' },
								{ label: 'PNL ($)', value: 'est' },
							]}
						/>
					</div>

					{!isMobile ? (
						<Radio.Group
							buttonStyle="solid"
							className="period-styled"
							onChange={(e) => setCurrentPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
							defaultValue="daily"
							optionType="button"
							options={PERIOD.map(({ label, value }) => ({ value, label: t(label) }))}
						/>
					) : (
						<Select
							className="min-w-[60px]"
							defaultValue="daily"
							onChange={(val: 'daily' | 'weekly' | 'monthly') => setCurrentPeriod(val)}
							options={PERIOD.map(({ label, value }) => ({ value, label: t(label) }))}
						/>
					)}
				</div>
			)}
			{bots && bots.length === 0 && (
				<div className="flex-1 flex flex-col justify-center items-center">
					<p>{t('no_bot')}</p>
					<Button
						className="button-primary w-[153px] flex items-center"
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => navigate('/bots/my-bot/create')}
					>
						{t('add_new_bot')}
					</Button>
				</div>
			)}
			{loading && (
				<div className="absolute inset-0 flex justify-center items-center h-full">
					<Loading />
				</div>
			)}
			{bots?.length > 0 && !loading && (
				<div
					className={`xxl:pl-[1.875rem] ${
						getData(currentPeriod).length > 0 &&
						getData(currentPeriod).findIndex(
							(v) => parseInt(v.avg_profit.toString()) !== 0 || parseInt(v.avg_est.toString()) !== 0
						) !== -1
							? 'mt-4'
							: 'mt-[6rem]'
					}`}
				>
					<div className="grid grid-cols-1 gap-x-8">
						<div className="xxl:block">
							<div className="card-body p-0">
								{getData(currentPeriod).length > 0 &&
								getData(currentPeriod).findIndex(
									(v) =>
										parseInt(v.avg_profit.toString()) !== 0 || parseInt(v.avg_est.toString()) !== 0
								) !== -1 ? (
									<BotPerformanceChart
										data={getData(currentPeriod)}
										labels={getLabels(currentPeriod)}
										type={currentInput}
										exchangeCode={selectedBot?.my_exchange.exchange_code || 'binance'}
									/>
								) : (
									<div className="h-full flex items-center justify-center flex-col">
										<NoDataYetIcon />
										<span className="text-sm mt-3">{t('no_data_yet')}</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default BotPerformanceView;
