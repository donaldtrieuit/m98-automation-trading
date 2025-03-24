import { makeAutoObservable, reaction } from 'mobx';
import { mockUser } from '@mockdata/users';

class AuthStore {
	user: any = null;
	isAuthenticated: boolean = false;
	unreadNotifyCount: number = 0;

	constructor() {
		makeAutoObservable(this);
		if (typeof window !== 'undefined') {
			this.isAuthenticated = localStorage.getItem('isAuthenticated') == 'true' || false;
		}
		reaction(
			() => this.isAuthenticated,
			(isAuthenticated) => {
				if (isAuthenticated) {
					localStorage.setItem('isAuthenticated', String(isAuthenticated));
				} else {
					localStorage.removeItem('isAuthenticated');
				}
			}
		);
	}

	loadUserProfile(user_id: number) {
		this.user = mockUser.find((user) => user.user_id === user_id);
	}

	logout() {
		this.user = null;
		this.isAuthenticated = false;
	}

	setIsAuthenticated(isAuthenticated: boolean): void {
		this.isAuthenticated = isAuthenticated;
	}

	setUnreadNotifyCount(count: number) {
		this.unreadNotifyCount = count;
	}

	markAllNotifyAsRead() {
		return (this.unreadNotifyCount = 0);
	}

	getConvertedCurrency(value: number) {
		return `$${Math.round(value * 1000000) / 1000000}`;
	}
}

export default new AuthStore();
