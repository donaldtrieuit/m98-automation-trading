import React, { useEffect, useMemo, useRef, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ColorType, createChart, IChartApi, ISeriesApi, SeriesOptionsCommon } from 'lightweight-charts';
import { useStore } from '@providers/AppProvider';
import { useThemeContext } from '@providers/ThemeProvider';

// Interface for chart data points
interface ChartDataPoint {
	time: string;
	value: number;
}

// Interface for raw data from props
interface RawData {
	avg_profit: number;
	avg_est: number;
}

// Interface for props
interface BotPerformanceChartProps extends WithTranslation {
	data: RawData[];
	labels: string[];
	type: 'profit' | 'est';
	exchangeCode: string;
}

const BotPerformanceChart: React.FC<BotPerformanceChartProps> = ({ data, labels, type, exchangeCode }) => {
	const { stateStore } = useStore();
	const { typeTheme } = useThemeContext();
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState<number>(0);

	const formatDate = (dateString: string): string => {
		if (dateString) {
			const parts = dateString.split('/');
			const year = parts[0] || '2023';
			const month = parts[1]?.padStart(2, '0') || '01';
			const day = parts[2]?.padStart(2, '0') || '01';
			return `${year}-${month}-${day}`;
		}
		return '2023-06-06';
	};

	const formatChartData = (datas: { date: string, value: number }[]): ChartDataPoint[] =>
		datas.map((item) => ({ ...item, time: formatDate(item.date) }));

	const chartDatas = useMemo<ChartDataPoint[]>(() => {
		if (!labels || labels.length === 0) {
			return [];
		}

		return formatChartData(
			data.map(({ avg_profit, avg_est }, index) => ({
				date: labels[index],
				value: type === 'profit' ? avg_profit : avg_est,
			}))
		);
	}, [data, labels, type]);

	useEffect(() => {
		const element = chartContainerRef.current;
		if (!element) return;

		const resizeObserver = new ResizeObserver(() => {
			setWidth(element.clientWidth);
		});
		resizeObserver.observe(element);
		return () => resizeObserver.disconnect();
	}, []);

	useEffect(() => {
		if (!chartContainerRef.current || width === 0) return;

		const chart: IChartApi = createChart(chartContainerRef.current, {
			layout: {
				textColor: 'rgba(40, 43, 56, 1)',
				background: { type: ColorType.Solid, color: typeTheme === 'dark' ? '#1E1F25' : 'white' },
			},
			width,
			height: 486,
			rightPriceScale: {
				borderVisible: false,
				autoScale: true,
			},
			timeScale: {
				borderVisible: false,
			},
			grid: {
				vertLines: {
					color: 'transparent',
				},
				horzLines: {
					color: 'rgba(217, 217, 217, 1)',
				},
			},
			handleScroll: false,
			handleScale: false,
		});

		const handleResize = () => {
			chart.applyOptions({ width: chartContainerRef.current?.clientWidth || 0 });
		};

		chart.timeScale().fitContent();

		const lineSeries: ISeriesApi<'Baseline'> = chart.addBaselineSeries({
			topLineColor: '#11CABE',
			topFillColor1: 'rgba(17, 202, 190, 0.2)',
			topFillColor2: 'rgba(17, 202, 190, 0)',
			bottomLineColor: '#FA2256',
			bottomFillColor1: 'rgba(250, 34, 86, 0)',
			bottomFillColor2: 'rgba(250, 34, 86, 0.2)',
			lineWidth: 2,
			priceFormat: {
				type: 'custom',
				formatter: (price: number): string => {
					return type === 'profit'
						? `${price.toFixed(2)}%`
						: `${stateStore.getCurrency(price, exchangeCode)}`;
				},
			},
		} as unknown as SeriesOptionsCommon);

		const filteredData: ChartDataPoint[] = [];
		let prevValue: number | null = null;
		for (const point of chartDatas) {
			if (point.value !== 0 || prevValue !== 0) {
				filteredData.push(point);
			}
			prevValue = point.value;
		}
		lineSeries.setData(filteredData);

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			chart.remove();
		};
	}, [chartDatas, width, typeTheme, type, stateStore, exchangeCode]);

	return <div ref={chartContainerRef} className="TVChartContainer" />;
};

export default withTranslation()(BotPerformanceChart);
