import React from 'react';
import { Navigate, Route, Routes, BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme, ThemeConfig } from 'antd';
import ScrollToTop from '@components/scroll';
import { useResponsive } from '@hooks/useResponsive';

const MainLayout = React.lazy(() => import('@components/layouts/main/MainLayout'));
const AdminLayout = React.lazy(() => import('@components/layouts/main/AdminLayout'));
const LoginPage = React.lazy(() => import('@pages/login'));
const RegisterPage = React.lazy(() => import('@pages/register'));
const DashBoardPage = React.lazy(() => import('@pages/admin/dashboard'));
const MyExchangesPage = React.lazy(() => import('@pages/admin/exchanges'));
const TransactionsPage = React.lazy(() => import('@pages/admin/transactions'));
const BotsPage = React.lazy(() => import('@pages/admin/bots'));

const Pages = () => {
	const { isMediumScreen } = useResponsive();

	const themeConfig: ThemeConfig = {
		algorithm: theme.defaultAlgorithm,
		token: {
			// Font
			fontFamily: '"Poppins", sans-serif',
			fontSize: 14,
			// Radius
			borderRadius: 8,
		},
		components: {
			Layout: {
				bodyBg: '#F6F8FB',
			},
			Button: {
				controlHeight: 40,
				controlHeightLG: isMediumScreen ? 43 : 52,
				fontWeight: 500,
			},
			Form: {
				labelColor: '#366890',
				labelFontSize: isMediumScreen ? 14 : 20,
			},
			Input: {
				lineWidth: 1,
				inputFontSizeLG: isMediumScreen ? 14 : 20,
				colorTextPlaceholder: 'rgba(165, 165, 165, 0.72)',
				controlHeight: 40,
				controlHeightLG: isMediumScreen ? 43 : 52,
				paddingBlockLG: isMediumScreen ? 9 : 15,
				activeShadow: 'none',
				errorActiveShadow: 'none',
				colorFillSecondary: '#F1F5F5',
				colorFillTertiary: '#F1F5F5',
				hoverBg: '#F1F5F5',
				activeBg: '#F1F5F5',
				colorBgContainer: '#F1F5F5',
			},
			Select: {
				lineWidth: 1,
				fontSizeLG: isMediumScreen ? 14 : 20,
				optionFontSize: 14,
				colorTextPlaceholder: 'rgba(165, 165, 165, 0.72)',
				colorIcon: '#fff',
				controlHeight: 40,
				controlHeightLG: isMediumScreen ? 43 : 52,
				colorBgContainer: '#F1F5F5',
				colorFillSecondary: '#F1F5F5',
				colorFillTertiary: '#F1F5F5',
			},
			DatePicker: {
				lineWidth: 1,
				fontSizeLG: isMediumScreen ? 14 : 20,
				colorTextPlaceholder: 'rgba(165, 165, 165, 0.72)',
				colorIcon: '#366890',
				controlHeight: 40,
				controlHeightLG: isMediumScreen ? 43 : 52,
				paddingBlockLG: isMediumScreen ? 9 : 15,
				activeShadow: 'none',
				errorActiveShadow: 'none',
				colorBgContainer: '#F1F5F5',
				colorFillSecondary: '#F1F5F5',
				colorFillTertiary: '#F1F5F5',
			},
			Checkbox: {
				borderRadius: 4,
				controlHeight: 24,
				controlInteractiveSize: 24,
				fontSize: 20,
			},
			Steps: {
				colorBorderBg: '#747679',
			},
			Slider: {
				controlSize: 15,
				trackHoverBg: '#366890',
				trackBg: '#366890',
				railBg: '#DDE3E9',
				railHoverBg: '#DDE3E9',
				railSize: 15,
				handleActiveColor: '#FFFFFF',
				handleColor: '#FFFFFF',
				handleSize: 36,
				handleSizeHover: 37,
				handleLineWidth: '0.5px',
				handleLineWidthHover: '0.5px',
			},
			Divider: {
				colorSplit: '#AFB9C5',
			},
		},
	};

	return (
		<ConfigProvider theme={themeConfig}>
			<BrowserRouter>
				<ScrollToTop />
				<Routes>
					<Route path="/" element={<MainLayout />}>
						<Route index element={<LoginPage />} />
						<Route path="login" element={<LoginPage />} />
						<Route path="sign-up" element={<RegisterPage />} />
					</Route>
					<Route path="/" element={<AdminLayout />}>
						<Route path="dashboard" element={<DashBoardPage />} />
						<Route path="exchanges" element={<MyExchangesPage />} />
						<Route path="transactions" element={<TransactionsPage />} />
						<Route path="bots" element={<BotsPage />} />
					</Route>
					<Route path="*" element={<Navigate to={'/'} />} />
				</Routes>
			</BrowserRouter>
		</ConfigProvider>
	);
};

export default Pages;
