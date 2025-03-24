import React from 'react';
import { observer } from 'mobx-react';
import { withTranslation, WithTranslation } from 'react-i18next';
import NotificationDropdown from './NotificationDropdown';
import { useStore } from '@providers/AppProvider';
import ProfileDropdown from '@components/layouts/header/components/ProfileDropdown'; // Adjust path

interface DesktopHeaderProps extends WithTranslation {
	headerName: string[];
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ t, headerName }) => {
	const { stateStore } = useStore();
	return (
		<div className="w-full flex items-center justify-between">
			<div className="flex flex-row items-center gap-2 text-primary text-[22px] font-semibold">
				{stateStore.headerTitle ||
					(headerName.join(' ').length === 0
						? t('home_title')
						: headerName.join(' ') === 'dashboard dark'
							? t('home_title')
							: t(headerName.join('-')))}
			</div>
			<div className="flex items-center space-x-6">
				<NotificationDropdown />
				<ProfileDropdown />
			</div>
		</div>
	);
};

export default withTranslation()(observer(DesktopHeader));
