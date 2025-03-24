import { MyExchange } from './exchanges';

export type Bot = {
	id: number,
	user_id: number,
	name: string,
	test_mode: boolean,
	my_exchange: MyExchange,
	status: 'on' | 'off',
	created: string,
	modified: string,
	daily_pnl_percent: number,
	daily_pnl_est: number,
	est: number,
	profit: number,
	est_no_holdings: number,
	profit_no_holdings: number,
	bot_type: 'volatility',
};
