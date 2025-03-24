export type Exchange = {
	id: number,
	user_id: number,
	exchange: string,
	mode: 'spot' | 'future',
	name: string,
	api_key: string,
	latest_updated: string,
	status: string,
	restrictions: null | any,
	parent_id: string,
	created: string,
	modified: string,
	total_balance_to_btc: number,
	total_balance_to_usd: number,
	portfolio_pnl: number,
	portfolio_pnl_percent: number,
	portfolio_thirty_days_pnl: number,
	portfolio_thirty_days_pnl_percent: number,
};

export type TokenData = {
	id: number,
	exchange: number,
	symbol: string,
	free: string,
	locked: string,
	total: string,
	asset_btc: number,
	asset_usdt: number,
};

export type MyExchange = {
	id: number,
	name: string,
	exchange_code: string,
	exchange_mode: 'spot' | 'future',
};
