import { measureTextWidth } from '@antv/g2plot/lib/utils/measure-text';
import dayjs from 'dayjs';
import { BOT_STATUS_LIST } from './contants';

export const getFearIndicatorColor = (value: any) => {
	let color = '#000000';
	switch (value) {
		case 'Extreme Fear':
			color = '#EE243A';
			break;
		case 'Fear':
			color = '#EF7B32';
			break;
		case 'Neutral':
			color = '#F3BA2F';
			break;
		case 'Greed':
			color = '#30E0A1';
			break;
		default:
			color = '#18E33A';
			break;
	}
	return color;
};

export const renderStatistic = (
	containerWidth: any,
	text: string,
	style: { fontSize: any, color?: any, textAlign?: any, typeTheme?: any },
	currentValue = ''
) => {
	const textWidth = measureTextWidth(text, style);
	let scale = 1;

	if (containerWidth < textWidth) {
		scale = (containerWidth - 20) / textWidth;
	}

	const currentValueElement = currentValue
		? `<div style="background-color: ${style.color}" class="${
				style?.typeTheme === 'dark' ? 'text-black' : 'text-white'
			} inline-flex justify-center font-medium text-[14px] leading-[30px] greed-value-item">
		${currentValue || ''}
	</div> `
		: '';
	return `<div style="text-align:${style.textAlign};font-size:${scale * style.fontSize}px;color:${
		style.color
	};line-height:${scale < 1 ? 1 : 'inherit'};">${currentValueElement}${text}</div>`;
};

export const uppercaseFirstLetter = (str: any) => {
	if (!str || typeof str !== 'string') return '-';
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const handleGetExchangeLogo = (exchange: string) => {
	const exchangeStr = exchange?.split(' ')[0]?.toLowerCase();
	switch (exchangeStr) {
		case 'mercado':
			return '/images/mercado_logo.svg';
		case 'binance':
			return '/images/binance_logo.svg';
		case 'ftx':
			return '/images/ftx_logo.svg';
		case 'gate':
			return '/images/gate_logo.png';
		case 'coinbase':
			return '/images/coinbase_logo.png';
		case 'huobi':
			return '/images/huobi_logo.png';
		case 'kucoin':
			return '/images/kucoin_logo.png';
		case 'novadax':
			return '/images/novadax_logo.png';
		case 'hollaex':
			return '/images/hollaex_logo.png';
		case 'okx':
			return '/images/okx_logo.png';
		case 'bybit':
			return '/images/bybit_logo.png';
		case 'bingx':
			return '/images/bingX.webp';
		case 'bitget':
			return '/images/bitget_logo_large.svg';
		case 'hyperliquid':
			return '/images/hyperliquid_logo.jpeg';
		default:
			return '';
	}
};

export const handleGetMarketChangeLogo = (isUp: any) => {
	switch (isUp) {
		case true:
			return '/images/market-change/market_up.svg';
		default:
			return '/images/market-change/market_down.svg';
	}
};

export const handleGetExchangeLargeLogo = (exchange: any) => {
	switch (exchange) {
		case 'mercado':
			return '/images/mercado_logo_large.png';
		case 'binance':
			return '/images/binance_logo_large.svg';
		case 'gate':
			return '/images/gate_logo_large.png';
		case 'coinbase':
			return '/images/coinbase_logo_large.svg';
		case 'huobi':
			return '/images/huobi_logo_large.png';
		case 'kucoin':
			return '/images/kucoin_logo_large.png';
		case 'novadax':
			return '/images/novadax_logo_large.webp';
		case 'hollaex':
			return '/images/hollaex_logo_large.webp';
		case 'okx':
			return '/images/okx_logo_large.png';
		case 'bybit':
			return '/images/bybit_logo_large.svg';
		case 'bingx':
			return '/images/bingx_logo.png';
		case 'bitget':
			return '/images/bitget_logo_large.svg';
		case 'hyperliquid':
			return '/images/hyperliquid_logo_large.svg';
		default:
			return '';
	}
};

export const getExchangeName = (exchange: any) => {
	switch (exchange) {
		case 'mercado':
			return 'Mercado Bitcoin';
		case 'binance':
			return 'Binance';
		case 'ftx':
			return 'FTX';
		case 'gate':
			return 'Gate.io';
		case 'coinbase':
			return 'Coinbase';
		case 'huobi':
			return 'Huobi';
		case 'kucoin':
			return 'KuCoin';
		case 'novadax':
			return 'NovaDAX';
		case 'hollaex':
			return 'HollaEx';
		case 'okx':
			return 'OKX';
		case 'bybit':
			return 'Bybit';
		case 'bingx':
			return 'BingX';
		default:
			return '-';
	}
};

export const getLanguageLabel = (language: any) => {
	switch (language) {
		case 'en':
			return 'English';
		case 'es':
			return 'Spanish';
		case 'vi':
			return 'Tiếng Việt';
		default:
			return 'Português';
	}
};

export const getMoneyFormat = (value: number) => {
	const formattedValue = `${value}`?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	if (formattedValue.split('.')[1]?.length === 1) {
		return `${formattedValue}0`;
	}
	return formattedValue;
};

export const getMoneyText = (value: number, currency: string) =>
	`${value < 0 ? '-' : ''}${currency === 'usd' ? '$' : 'R$'}${getMoneyFormat(Math.abs(value))}`;

export const getDateFromWeek = (year: number, weekNumber: number) => {
	const date = new Date(year, 0, 1 + (weekNumber - 1) * 7);
	const day = date.getDay();

	if (day <= 4) {
		date.setDate(date.getDate() - date.getDay() + 1);
	} else {
		date.setDate(date.getDate() + 8 - date.getDay());
	}
	return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
		.getDate()
		.toString()
		.padStart(2, '0')}`;
};

export const renderDateTimeTable = (timestamp: string) => {
	if (!timestamp) return '-';
	return dayjs.tz(parseInt(timestamp) * 1000).format('DD/MM/YYYY HH:mm:ss');
};

export const renderDateTable = (timestamp: string) => {
	const dateFormat = dayjs.tz(parseInt(timestamp) * 1000).format('DD/MM/YYYY HH:mm:ss');
	return dateFormat.split(' ')[0];
};

export const capitalizeFirstLetter = (str: string) => {
	const [firstChar, ...rest] = str;
	return firstChar.toUpperCase() + rest.join('');
};

export const matchBotStatusLabel = (status: string) => {
	switch (status) {
		case BOT_STATUS_LIST.on:
			return { label: 'bot_running', bgColor: '#009120' };
		case BOT_STATUS_LIST.pause:
			return { label: 'paused', bgColor: '#FFB800' };
		case BOT_STATUS_LIST.off:
			return { label: 'stopped', bgColor: '#EE2E2C' };
		case BOT_STATUS_LIST.created:
			return { label: 'created', bgColor: '#5D6589' };
		case BOT_STATUS_LIST.deleted:
			return { label: 'deleted', bgColor: '#EE2E2C' };

		default:
			return { label: '' };
	}
};
