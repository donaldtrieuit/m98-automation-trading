import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useLocation } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Layout, ConfigProvider } from 'antd';
import DesktopHeader from './components/DesktopHeader';
import MobileHeader from './components/MobileHeader';
import { useResponsive } from '@hooks/useResponsive';
import { useStore } from '@providers/AppProvider';

const { Header } = Layout;

const MainHeader: React.FC<WithTranslation> = ({ t }) => {
	const { isMediumScreen } = useResponsive();
	const { stateStore, authStore } = useStore();
	const location = useLocation();

	const path = location.pathname.split('/').filter(Boolean); // Split and remove empty strings
	const name = path[path.length - 1].split('-');
	const filterName = name.length >= 3 ? name.filter((_, i) => i > 0) : name;
	const finalName = filterName.includes('app')
		? filterName.filter((f) => f !== 'app')
		: filterName.includes('ui')
			? filterName.filter((f) => f !== 'ui')
			: filterName.includes('uc')
				? filterName.filter((f) => f !== 'uc')
				: filterName.includes('basic')
					? filterName.filter((f) => f !== 'basic')
					: filterName.includes('jquery')
						? filterName.filter((f) => f !== 'jquery')
						: filterName.includes('table')
							? filterName.filter((f) => f !== 'table')
							: filterName.includes('page')
								? filterName.filter((f) => f !== 'page')
								: filterName.includes('email')
									? filterName.filter((f) => f !== 'email')
									: filterName.includes('ecom')
										? filterName.filter((f) => f !== 'ecom')
										: filterName.includes('chart')
											? filterName.filter((f) => f !== 'chart')
											: filterName.includes('editor')
												? filterName.filter((f) => f !== 'editor')
												: filterName;

	useEffect(() => {
		if (location.pathname === '/dashboard') {
			if (!isMediumScreen) {
				stateStore.setHeaderTitle(
					<span className="font-normal text-[16px]">
						{t('home_title')},{' '}
						<span className="text-primary font-semibold">{authStore.user?.user_name}!</span>
					</span>
				);
			} else {
				stateStore.setHeaderTitle(t('home'));
			}
		} else if (location.pathname === '/exchanges') {
			stateStore.setHeaderTitle(t('my-wallets'));
		} else if (location.pathname.startsWith('/exchanges/')) {
			stateStore.setHeaderTitle(t('exchange_detail'));
		} else if (location.pathname === '/transactions') {
			stateStore.setHeaderTitle(t('transaction'));
		} else if (location.pathname === '/bots') {
			stateStore.setHeaderTitle(t('bots'));
		}
	}, [location.pathname, t, isMediumScreen, stateStore, authStore]);

	const themeConfig = {
		token: {
			colorTextBase: '#34384C',
			fontSize: 14,
		},
		components: {
			Layout: {
				headerBg: '#FFFFFF',
				controlHeight: 38,
				lineHeight: 38,
				controlPaddingHorizontal: 16,
			},
			Dropdown: {
				borderRadiusLG: 12,
				borderRadiusSM: 12,
				boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowSecondary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowTertiary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				colorBgMask: '#FFFFFF',
				colorBgElevated: '#FFFFFF',
			},
			Popover: {
				borderRadiusLG: 12,
				borderRadiusSM: 12,
				boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowSecondary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowTertiary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				colorBgMask: '#FFFFFF',
				colorBgElevated: '#FFFFFF',
			},
			Switch: {
				colorPrimary: '#339CFD',
				colorPrimaryHover: '#339CFD',
				colorTextBase: '#339CFD',
			},
		},
	};

	return (
		<ConfigProvider theme={themeConfig}>
			<Header className={`lg:pl-[42px] px-4 lg:pr-[34px] shadow-lg sticky z-[1000] top-0`}>
				{isMediumScreen ? <MobileHeader headerName={finalName} /> : <DesktopHeader headerName={finalName} />}
			</Header>
		</ConfigProvider>
	);
};

export default withTranslation()(observer(MainHeader));
