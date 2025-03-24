import { makeAutoObservable, reaction } from 'mobx';
import { keyToken } from '@utils';

class TokenStore {
	token: string | null = null;

	constructor() {
		makeAutoObservable(this);

		this.token = localStorage.getItem(keyToken) || '';
		reaction(
			() => this.token,
			(token) => {
				if (token) {
					localStorage.setItem(keyToken, token);
				}
			}
		);
	}

	isAuthenticated(): boolean {
		return !!this.token;
	}

	setToken(token: string | null): void {
		this.token = token;
	}

	logout(): void {
		this.token = '';
		localStorage.removeItem(keyToken);
	}

	getToken(): string | null {
		return this.token;
	}
}

export default new TokenStore();
