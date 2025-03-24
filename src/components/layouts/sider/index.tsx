import React, { useState } from 'react';
import { ConfigProvider, Drawer, Layout, ThemeConfig } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { useThemeContext } from '@providers/ThemeProvider';
import * as S from './MainSider.styles';
import { useResponsive } from '@hooks/useResponsive';
import { useMediaQuery } from 'react-responsive';

const { Sider } = Layout;

interface MenuItem {
	key: string;
	icon?: React.ReactNode;
	children?: MenuItem[];
	label: string;
	popupClassName?: string;
}

function getItem(
	label: string,
	key: string,
	icon?: React.ReactNode,
	children?: MenuItem[],
	popupClassName?: string
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
		popupClassName,
	};
}

const rootSubmenuKeys: string[] = ['/dashboard', '/exchanges', '/transaction', '/bots'];

const MainSider: React.FC<WithTranslation> = ({ t }) => {
	const { collapsed, openSider } = useThemeContext();
	const navigate = useNavigate(); // Replaces useHistory
	const location = useLocation();
	const { isMediumScreen } = useResponsive();
	const [openKeys, setOpenKeys] = useState<string[]>([]);

	const onOpenChange = (keys: string[]) => {
		const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
		if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
			setOpenKeys(keys);
		} else {
			setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
		}
	};

	const bigScreen = useMediaQuery({
		query: `(min-width: 1442px)`,
	});

	const onClick = (e: { key: string }) => {
		navigate(e.key);
		if (isMediumScreen) {
			openSider(!collapsed);
		}
	};

	const items: MenuItem[] = [
		getItem(
			t('home'),
			'/dashboard',
			<img className="w-[19px] h-[20px] rounded-none mr-2" src="/images/menu-icon/home.svg" alt="altimg" />
		),
		getItem(
			t('My Exchanges'),
			'/exchanges',
			<img className="w-[19px] h-[20px] rounded-none mr-2" src="/images/menu-icon/wallet.svg" alt="altimg" />
		),
		getItem(
			t('transaction'),
			'/transactions',
			<img className="w-[19px] h-[20px] rounded-none mr-2" src="/images/menu-icon/document.svg" alt="altimg" />
		),
		getItem(
			t('bots'),
			'/bots',
			<img className="w-[19px] h-[20px] rounded-none mr-2" src="/images/menu-icon/bot.svg" alt="altimg" />
		),
	];

	const themeConfig: ThemeConfig = {
		token: {
			fontSize: 16,
			colorBgSpotlight: '#1E1F25',
			borderRadiusLG: 8,
			borderRadiusSM: 8,
			colorTextBase: '#ffffff',
			colorBgBase: '#1E1F25',
			colorBgElevated: '#1E1F25',
			controlItemBgActive: '#333964',
			colorPrimary: '#ffffff',
		},
		components: {
			Menu: {
				itemBg: '#1E1F25',
				controlHeightLG: 56,
			},
			Drawer: {
				colorBgElevated: '#1E1F25',
			},
			Tooltip: {
				borderRadiusLG: 12,
				borderRadiusSM: 12,
				boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowSecondary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowTertiary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				colorBgMask: '#FFFFFF',
				colorBgElevated: '#FFFFFF',
				colorBgSpotlight: '#1E1F25',
			},
		},
	};

	const getSiderMenu = () => (
		<div className="pb-[50px]">
			<S.Menu
				defaultSelectedKeys={[location.pathname]}
				mode="inline"
				items={items}
				onClick={onClick}
				selectedKeys={[location.pathname]}
				openKeys={openKeys}
				onOpenChange={onOpenChange}
			/>
		</div>
	);

	const onClickCollapseSidebar = () => {
		const newCollapsed = !collapsed;
		openSider(newCollapsed);
	};

	return (
		<ConfigProvider theme={themeConfig}>
			{isMediumScreen ? (
				<Drawer title="Menu" placement="left" onClose={() => openSider(!collapsed)} open={collapsed}>
					{getSiderMenu()}
				</Drawer>
			) : (
				<Sider
					width={bigScreen ? 342 : 272}
					className={`${!collapsed && bigScreen ? 'px-[32px] min-w-[278px]' : ''} ${
						!collapsed && bigScreen ? 'uncollapsedClass' : 'collapsedClass'
					} py-[20px] sticky top-0 left-0 overflow-x-hidden h-screen`}
					collapsed={collapsed}
					defaultCollapsed={collapsed}
					trigger={null}
					style={{ background: '#1E1F25' }}
				>
					<div
						className={`flex items-center h-[76px] mb-[64px] ${
							collapsed ? 'justify-center' : 'justify-between px-[12px] pt-[8px]'
						}`}
					>
						<div className={`${collapsed ? '' : 'w-[80%]'} flex items-center gap-3`}>
							<img
								className={`${collapsed ? 'hidden' : 'h-auto'}`}
								src="/images/logo-white.png"
								alt="Logo"
							/>
						</div>
						<button onClick={onClickCollapseSidebar}>
							<img
								className="w-[24px] h-[24px]"
								src={`${collapsed ? '/images/open_sider.svg' : '/images/close_sider.svg'}`}
								alt="menu-icon"
							/>
						</button>
					</div>
					{getSiderMenu()}
				</Sider>
			)}
		</ConfigProvider>
	);
};

export default withTranslation()(observer(MainSider));
