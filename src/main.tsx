import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import Router from './router';
import { Spin } from 'antd';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppProvider from '@providers/AppProvider';
import ThemeContextProvider from '@providers/ThemeProvider';
import './i18nextInit';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import utc from 'dayjs/plugin/utc';
import GlobalStyle from './styles/GlobalStyle';

const root = document.getElementById('root') as HTMLElement;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(localeData);

createRoot(root).render(
	// <StrictMode>
	<Suspense fallback={<Spin spinning fullscreen />}>
		<AppProvider>
			<GlobalStyle />
			<ThemeContextProvider>
				<Router />
			</ThemeContextProvider>
		</AppProvider>
		<ToastContainer />
	</Suspense>
	// </StrictMode>
);
