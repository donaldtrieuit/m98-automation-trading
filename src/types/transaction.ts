export type Transaction = {
	id: number,
	bot: number,
	bot_name: string,
	exchange_code: string,
	coin: string,
	order_id: string,
	side: 'BUY' | 'SELL', // Union type restricting to "BUY" or "SELL"
	order_type: 'MARKET' | 'LIMIT', // Assuming common order types; adjust as needed
	amount: number,
	price: string, // Kept as string to preserve precision from your data
	est: number,
	cost: string, // String to match precision in your data
	executed_qty: number,
	fee_cost: string, // String for precision
	fee_currency: string,
	profit: number,
	created: string, // Unix timestamp as string (could be number if preferred)
	modified: string, // Unix timestamp as string
};

export type BoughtCoin = {
	id: number,
	bot: number,
	bot_name: string,
	exchange_code: string,
	exchange_mode: 'spot' | 'future',
	symbol: string,
	volume: string,
	order_id: string,
	bought_at: string,
	stop_loss: string,
	take_profit: string,
	leverage_mode: 'isolated' | 'cross',
	leverage: number,
	initial_margin: string,
	timestamp: string,
	pnl: number,
	pnl_percent: number,
	mark_price: number,
};
