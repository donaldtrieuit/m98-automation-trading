import dayjs from 'dayjs';

export const generateMockFearGreedData = (): Array<{
	value: string,
	value_classification: string,
	timestamp: string,
}> => {
	const data = [];
	const today = dayjs('2025-03-20'); // Current date from your system info
	const classifications = ['Extreme Fear', 'Fear', 'Neutral', 'Greed', 'Extreme Greed'];

	for (let i = 0; i < 30; i++) {
		const date = today.subtract(i, 'day');
		const value = Math.floor(Math.random() * 101); // Random value between 0 and 100
		const classification = classifications[Math.floor(value / 25)]; // Rough mapping: 0-24 Extreme Fear, 25-49 Fear, etc.
		data.push({
			value: value.toString(), // API returns strings, parsed later
			value_classification: classification,
			timestamp: Math.floor(date.valueOf() / 1000).toString(), // Unix timestamp in seconds
		});
	}

	return data.reverse(); // Reverse to have oldest first, newest last (index 0 is 30 days ago, 29 is today)
};

// Mock data matching the provided JSON structure
export const mockTickerData = {
	data: {
		top_10_gainers: [
			{
				qc_key: 'ORCA',
				symbol_name: 'Orca',
				rank: 312,
				price24h: 1.67596,
				price_usd: 4.5402,
			},
			{
				qc_key: 'ZRO',
				symbol_name: 'LayerZero',
				rank: 146,
				price24h: 0.244469,
				price_usd: 3.13252,
			},
			{
				qc_key: 'BONE',
				symbol_name: 'Bone ShibaSwap',
				rank: 378,
				price24h: 0.236307,
				price_usd: 0.290541,
			},
			{
				qc_key: 'PEPECOIN',
				symbol_name: 'PepeCoin',
				rank: 409,
				price24h: 0.182034,
				price_usd: 0.518251,
			},
			{
				qc_key: 'ARC',
				symbol_name: 'AI Rig Complex',
				rank: 399,
				price24h: 0.169167,
				price_usd: 0.0601291,
			},
			{
				qc_key: 'CHEEMS',
				symbol_name: 'Cheems Token',
				rank: 144,
				price24h: 0.117439,
				price_usd: 0.00000150563,
			},
			{
				qc_key: 'ACX',
				symbol_name: 'Across Protocol',
				rank: 274,
				price24h: 0.117279,
				price_usd: 0.294643,
			},
			{
				qc_key: 'VANA',
				symbol_name: 'Vana',
				rank: 194,
				price24h: 0.0969596,
				price_usd: 7.01039,
			},
			{
				qc_key: 'ACH',
				symbol_name: 'Alchemy Pay',
				rank: 257,
				price24h: 0.0897406,
				price_usd: 0.0252122,
			},
			{
				qc_key: 'DOGS',
				symbol_name: 'DOGS',
				rank: 343,
				price24h: 0.0867324,
				price_usd: 0.000155275,
			},
		],
		top_10_losers: [
			{
				qc_key: 'USUAL',
				symbol_name: 'Usual',
				rank: 267,
				price24h: -0.107503,
				price_usd: 0.137867,
			},
			{
				qc_key: 'MYRO',
				symbol_name: 'Myro',
				rank: 516,
				price24h: -0.110021,
				price_usd: 0.0179987,
			},
			{
				qc_key: 'OMI',
				symbol_name: 'ECOMI',
				rank: 355,
				price24h: -0.11203,
				price_usd: 0.000261026,
			},
			{
				qc_key: 'SFM',
				symbol_name: 'SafeMoon',
				rank: 503,
				price24h: -0.120265,
				price_usd: 0.0000771774,
			},
			{
				qc_key: 'DIONE',
				symbol_name: 'Dione',
				rank: 484,
				price24h: -0.132532,
				price_usd: 0.00245119,
			},
			{
				qc_key: 'RSS3',
				symbol_name: 'RSS3',
				rank: 349,
				price24h: -0.145839,
				price_usd: 0.0714346,
			},
			{
				qc_key: 'PLUME',
				symbol_name: 'Plume',
				rank: 107,
				price24h: -0.166174,
				price_usd: 0.191273,
			},
			{
				qc_key: 'PI',
				symbol_name: 'Pi Network',
				rank: 15,
				price24h: -0.231125,
				price_usd: 0.90959,
			},
			{
				qc_key: 'MAVIA',
				symbol_name: 'Heroes of Mavia',
				rank: 499,
				price24h: -0.295859,
				price_usd: 0.304948,
			},
			{
				qc_key: 'LINA',
				symbol_name: 'Linear',
				rank: 533,
				price24h: -0.304534,
				price_usd: 0.00132564,
			},
		],
		top_20_coins: [
			{
				qc_key: 'BTC',
				symbol_name: 'Bitcoin',
				rank: 1,
				price24h: -0.0256401,
				price_usd: 83981.1,
			},
			{
				qc_key: 'ETH',
				symbol_name: 'Ethereum',
				rank: 2,
				price24h: -0.0196847,
				price_usd: 1972.61,
			},
			{
				qc_key: 'XRP',
				symbol_name: 'XRP',
				rank: 3,
				price24h: -0.0386807,
				price_usd: 2.40735,
			},
			{
				qc_key: 'BNB',
				symbol_name: 'BNB',
				rank: 4,
				price24h: -0.00560947,
				price_usd: 630.563,
			},
			{
				qc_key: 'SOL',
				symbol_name: 'Solana',
				rank: 5,
				price24h: -0.0456693,
				price_usd: 128.243,
			},
			{
				qc_key: 'ADA',
				symbol_name: 'Cardano',
				rank: 6,
				price24h: -0.031957,
				price_usd: 0.710444,
			},
			{
				qc_key: 'DOGE',
				symbol_name: 'Dogecoin',
				rank: 7,
				price24h: -0.0415412,
				price_usd: 0.167885,
			},
			{
				qc_key: 'TRX',
				symbol_name: 'TRON',
				rank: 8,
				price24h: 0.0160889,
				price_usd: 0.234113,
			},
			{
				qc_key: 'LINK',
				symbol_name: 'Chainlink',
				rank: 9,
				price24h: -0.0395661,
				price_usd: 14.1539,
			},
			{
				qc_key: 'LEO',
				symbol_name: 'LEO Token',
				rank: 10,
				price24h: -0.00407487,
				price_usd: 9.81375,
			},
			{
				qc_key: 'TONCOIN',
				symbol_name: 'Toncoin',
				rank: 11,
				price24h: -0.00844303,
				price_usd: 3.62235,
			},
			{
				qc_key: 'XLM',
				symbol_name: 'Stellar',
				rank: 12,
				price24h: -0.0215522,
				price_usd: 0.280506,
			},
			{
				qc_key: 'HBAR',
				symbol_name: 'Hedera',
				rank: 13,
				price24h: -0.0459436,
				price_usd: 0.18541,
			},
			{
				qc_key: 'AVAX',
				symbol_name: 'Avalanche',
				rank: 14,
				price24h: -0.0273769,
				price_usd: 18.659,
			},
			{
				qc_key: 'PI',
				symbol_name: 'Pi Network',
				rank: 15,
				price24h: -0.231125,
				price_usd: 0.90959,
			},
			{
				qc_key: 'SUI',
				symbol_name: 'Sui',
				rank: 16,
				price24h: -0.0782471,
				price_usd: 2.28251,
			},
			{
				qc_key: 'SHIB',
				symbol_name: 'Shiba Inu',
				rank: 17,
				price24h: -0.0133847,
				price_usd: 0.0000127662,
			},
			{
				qc_key: 'LTC',
				symbol_name: 'Litecoin',
				rank: 18,
				price24h: 0.00767718,
				price_usd: 93.3652,
			},
			{
				qc_key: 'BCH',
				symbol_name: 'Bitcoin Cash',
				rank: 19,
				price24h: -0.0352324,
				price_usd: 332.851,
			},
			{
				qc_key: 'DOT',
				symbol_name: 'Polkadot',
				rank: 20,
				price24h: 0.00242484,
				price_usd: 4.48617,
			},
		],
		qc_100_24h_ptc_change_index: -0.0315906,
	},
	currency: {
		currency_code: 'USD',
		locale: 'en',
		conv_rate: 1,
	},
};
