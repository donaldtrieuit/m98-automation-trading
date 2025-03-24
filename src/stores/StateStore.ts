import { makeAutoObservable } from 'mobx';

class StateStore {
	headerTitle: string | any = '';
	language = localStorage.getItem('language') || 'en';

	currency = 'usd';

	brl2UsdExchangeRate = 1;

	constructor() {
		makeAutoObservable(this);
	}

	setHeaderTitle(title: any) {
		this.headerTitle = title;
	}

	getCurrency(value: number, exchange: string): string {
		const isNegative = value < 0;
		let rate = 1;
		if (exchange === 'mercado' && this.currency === 'usd') {
			rate = this.brl2UsdExchangeRate;
		}
		const v = Math.round(((Math.abs(value) || 0) * 100) / rate) / 100;
		const moneyFormat = `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

		if (this.currency === 'brl' || exchange === 'mercado') {
			return `${isNegative ? '-' : ''}R$${moneyFormat}`;
		}
		if (this.currency === 'vnd') {
			return `${isNegative ? '-' : ''}₫${moneyFormat}`;
		}
		return `${isNegative ? '-' : ''}$${moneyFormat}`;
	}
}

export default new StateStore();
