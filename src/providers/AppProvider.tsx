import React, { createContext, useContext, useEffect, useState, useRef, useMemo, ReactNode } from 'react';
import { observer } from 'mobx-react';

import AppStore from '@stores/AppStore';

export interface AppContextProps {
	store: AppStore;
	isAuthenticated: boolean;
	isLoading: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useStore = (): AppStore => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useStore must be used within an AppContextProvider');
	}
	return context.store;
};

export const useAuth = (): AppContextProps => useContext(AppContext) as AppContextProps;

interface AppContextProviderProps {
	children: ReactNode;
}

const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const store = useRef(new AppStore());
	const contextValue = useMemo(
		() => ({
			store: store.current,
			isAuthenticated,
			isLoading,
		}),
		[isAuthenticated, isLoading]
	);

	const { tokenStore, authStore } = store.current;

	useEffect(() => {
		setIsLoading(true);
		if (tokenStore.isAuthenticated()) {
			authStore.loadUserProfile(1);
			setIsAuthenticated(true);
			setIsLoading(false);
			authStore.setIsAuthenticated(true);
			return;
		}
		setIsAuthenticated(false);
		setIsLoading(false);
		authStore.setIsAuthenticated(false);
	}, [tokenStore.token]);

	return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export default observer(AppContextProvider);
