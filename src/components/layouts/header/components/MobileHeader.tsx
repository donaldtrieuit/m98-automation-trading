import React from 'react';
import { observer } from 'mobx-react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Button, Typography } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import NotificationDropdown from './NotificationDropdown';
import { useThemeContext } from '@providers/ThemeProvider'; // Adjust path
import { useStore } from '@providers/AppProvider';
import ProfileDropdown from '@components/layouts/header/components/ProfileDropdown'; // Adjust path

const { Text } = Typography;

interface MobileHeaderProps extends WithTranslation {
	headerName: string[];
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ t, headerName }) => {
	const { collapsed, openSider } = useThemeContext();
	const { stateStore } = useStore();

	return (
		<div className="w-full flex items-center justify-between">
			<div className="flex flex-row items-center gap-2">
				<Button
					className="button-icon"
					type="text"
					icon={<MenuOutlined />}
					onClick={() => openSider(!collapsed)}
				/>
				<Text
					className="text-[16px] font-semibold"
					style={{
						width: 150,
					}}
					ellipsis
				>
					{stateStore.headerTitle ||
						(headerName.join(' ').length === 0
							? t('home')
							: headerName.join(' ') === 'dashboard dark'
								? t('home')
								: t(headerName.join('-')))}
				</Text>
			</div>
			<div className="flex items-center space-x-3">
				<NotificationDropdown />
				<ProfileDropdown />
			</div>
		</div>
	);
};

export default withTranslation()(observer(MobileHeader));
