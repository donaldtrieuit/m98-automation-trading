import React, { useEffect, useState, useMemo, memo } from 'react';
import { G2, Gauge, GaugeConfig } from '@ant-design/plots';
import dayjs from 'dayjs';
import { useTranslation, UseTranslationResponse } from 'react-i18next';
import { Divider } from 'antd';
import { getFearIndicatorColor, renderStatistic } from '@utils';
import { themeObject } from '../../../../styles/themes/themeVariables';
import { useThemeContext } from '@providers/ThemeProvider';
import { generateMockFearGreedData } from '@mockdata/dashboard';

// Interfaces
interface FearGreedData {
	value: number;
	value_classification: string;
	date?: string;
	color?: string;
}

interface PreviousCloseItem {
	dataItem: FearGreedData;
	label: string;
}

const FearAndGreedView: React.FC = () => {
	const { t }: UseTranslationResponse<'translation', undefined> = useTranslation();
	const [currentFearGreed, setCurrentFearGreed] = useState<FearGreedData>({
		value: 0,
		value_classification: '',
	});
	const [lastWeekFearGreed, setLastWeekFearGreed] = useState<FearGreedData>({
		value: 0,
		value_classification: '',
	});
	const [lastMonthFearGreed, setLastMonthFearGreed] = useState<FearGreedData>({
		value: 0,
		value_classification: '',
	});
	const [lastYearFearGreed] = useState<FearGreedData>({
		value: 13,
		value_classification: 'Extreme Fear',
		color: '#EE243A',
	});

	const previousClose: PreviousCloseItem[] = useMemo(
		() => [
			{
				dataItem: currentFearGreed,
				label: 'Previous close',
			},
			{
				dataItem: lastWeekFearGreed,
				label: '1 week ago',
			},
			{
				dataItem: lastMonthFearGreed,
				label: '1 month ago',
			},
			{
				dataItem: lastYearFearGreed,
				label: '1 year ago',
			},
		],
		[currentFearGreed, lastWeekFearGreed, lastMonthFearGreed, lastYearFearGreed]
	);

	const { typeTheme } = useThemeContext();
	const { registerShape, Util } = G2;

	registerShape('point', 'custom-gauge-indicator', {
		draw: function (cfg, container) {
			const { indicator, defaultColor } = cfg.customInfo;
			const { pointer } = indicator;
			const group = container.addGroup();

			// @ts-ignore
			const center = this.parsePoint({
				x: 0,
				y: 0,
			});

			if (pointer) {
				// @ts-ignore
				const { startAngle, endAngle } = Util.getAngle(cfg, this.coordinate);
				// @ts-ignore
				const radius = this.coordinate.getRadius();
				const midAngle = (startAngle + endAngle) / 2;
				const { x: x1, y: y1 } = Util.polarToCartesian(center.x, center.y, radius / 15, midAngle + 1 / Math.PI);
				const { x: x2, y: y2 } = Util.polarToCartesian(center.x, center.y, radius / 15, midAngle - 1 / Math.PI);
				const { x, y } = Util.polarToCartesian(center.x, center.y, radius * 0.65, midAngle);
				const path = [['M', center.x, center.y], ['L', x1, y1], ['L', x, y], ['L', x2, y2], ['Z']]; // pointer

				group.addShape('path', {
					name: 'pointer',
					attrs: {
						path,
						fill: defaultColor,
						...pointer.style,
					},
				});
			}

			return group;
		},
	});

	const gaugeConfig: GaugeConfig = useMemo(
		() => ({
			theme: typeTheme,
			percent: currentFearGreed.value / 100,
			height: 150,
			range: {
				ticks: [0, 0.25, 0.45, 0.55, 0.75, 1],
				color: ['#EE243A', '#EF7B32', '#F3BA2F', '#30E0A1', '#18E33A'],
			},
			innerRadius: 0.8,
			meta: {
				percent: {
					tickInterval: 0.5,
					formatter: (text: string) => text,
					tickCount: 4,
				},
			},
			axis: {
				label: {
					formatter: (v: string) => Number(v) * 100,
					style: {
						fill: '#282B38',
						fontSize: 12,
						fontWeight: 'normal',
					},
				},
				subTickLine: {
					count: 20,
				},
			},
			statistic: {
				title: {
					offsetY: 10,
					customHtml: (container: HTMLElement) => {
						const { width, height } = container.getBoundingClientRect();
						const d = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);
						const text = t(currentFearGreed.value_classification || '');
						const currentValue = currentFearGreed.value;
						return renderStatistic(
							d,
							text,
							{
								fontSize: 21,
								color: currentFearGreed.color,
								textAlign: 'center',
								typeTheme,
							},
							String(currentValue)
						);
					},
				},
				content: undefined,
			},
			gaugeStyle: {
				stroke: themeObject[typeTheme].cardPrimaryColor,
				lineWidth: 4,
			},
			startAngle: Math.PI,
			endAngle: 2 * Math.PI,
			indicator: {
				shape: 'custom-gauge-indicator',
				pointer: {
					style: {
						stroke: '#D0D0D0',
						lineWidth: 1,
						fill: '#D0D0D0',
					},
				},
			},
		}),
		[typeTheme, currentFearGreed]
	);

	useEffect(() => {
		// Mock the botService.getFearAndGreed(30) call
		const mockPromise = Promise.resolve({ data: generateMockFearGreedData() });
		mockPromise.then(({ data }: { data: Array<any> }) => {
			setCurrentFearGreed({
				value: parseInt(data[0].value),
				value_classification: data[0].value_classification,
				date: dayjs.tz(parseInt(data[0].timestamp) * 1000).format('DD/MM/YYYY'),
				color: getFearIndicatorColor(data[0].value_classification),
			});
			setLastWeekFearGreed({
				value: parseInt(data[6].value),
				value_classification: data[6].value_classification,
				date: dayjs.tz(parseInt(data[6].timestamp) * 1000).format('DD/MM/YYYY'),
				color: getFearIndicatorColor(data[6].value_classification),
			});
			setLastMonthFearGreed({
				value: parseInt(data[29].value),
				value_classification: data[29].value_classification,
				date: dayjs.tz(parseInt(data[29].timestamp) * 1000).format('DD/MM/YYYY'),
				color: getFearIndicatorColor(data[29].value_classification),
			});
		});
	}, []);

	return (
		<div>
			<h1 className="text-primary font-semibold text-[16px] leading-6">{t('Crypto Fear an Greed Indicator')}</h1>
			<p className="text-secondary font-normal text-[12px] leading-4">
				{t('Last Updated')}: {currentFearGreed.date}
			</p>
			<div className="my-5">
				<Gauge {...gaugeConfig} />
			</div>
			<div className="mt-10">
				<h1 className="text-primary font-semibold text-[16px] leading-6">
					{t('Crypto Fear an Greed Indicator')}
				</h1>
				{previousClose.map(({ dataItem, label }, idx) => (
					<div className="mt-5" key={idx}>
						<p className="text-secondary font-normal text-[12px] leading-4">{t(label)}</p>
						<div className="flex flex-row">
							<p className="font-semibold text-[16px] leading-[30px]" style={{ color: dataItem.color }}>
								{t(dataItem.value_classification || '')}
							</p>
							<div className="flex-1 flex items-center p-2">
								<Divider className="m-0" dashed />
							</div>
							<span
								className={`${
									typeTheme === 'dark' ? 'text-black' : 'text-white'
								} font-medium text-[14px] leading-[30px] greed-value-item`}
								style={{ backgroundColor: dataItem.color }}
							>
								{dataItem.value}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(FearAndGreedView);
