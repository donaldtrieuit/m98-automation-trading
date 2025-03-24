import tokenStore from './TokenStore';
import authStore from './AuthStore';
import stateStore from './StateStore';

export default class AppStore {
	tokenStore = tokenStore;
	authStore = authStore;
	stateStore = stateStore;
}
