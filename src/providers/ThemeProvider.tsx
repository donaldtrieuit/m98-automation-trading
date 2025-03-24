import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { layoutStorage, localstorageTypes } from '@utils';

export const defaultCollapsed = layoutStorage.get(localstorageTypes.collapsedLayout);

export interface ThemeContextType {
	collapsed: boolean;
	openSider: (collapsed: boolean) => void;
	typeTheme: string;
}

// Create the context with a default undefined value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = (): ThemeContextType => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useThemeContext must be used within a ThemeContextProvider');
	}
	return context;
};

interface ThemeContextProviderProps {
	children: React.ReactNode;
}

const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
	const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
	const root = useRef(document.querySelector(':root'));

	const openSider = useCallback((collapsed: boolean) => {
		setCollapsed(collapsed);
		localStorage.setItem('collapsed', String(collapsed)); // Kept as string for compatibility
	}, []);

	const themeContextValue = useMemo<ThemeContextType>(
		() => ({
			collapsed,
			openSider,
			typeTheme: 'light',
		}),
		[collapsed, openSider] // Include openSider due to useCallback dependency
	);

	useEffect(() => {
		const html = root.current;
		if (html) {
			html.setAttribute('data-no-transition', '');
			html.setAttribute('data-theme', 'light');
			// remove transition after layout update
			requestAnimationFrame(() => {
				html.removeAttribute('data-no-transition');
			});
		}
	}, []);

	useEffect(() => {
		layoutStorage.set(localstorageTypes.collapsedLayout, collapsed);
	}, [collapsed]);

	return <ThemeContext.Provider value={themeContextValue}>{children}</ThemeContext.Provider>;
};

export default ThemeContextProvider;
