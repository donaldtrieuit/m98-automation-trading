import React, { useState } from 'react';
import { Avatar, Divider, Popover, Tag } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';
import { useStore } from '@providers/AppProvider';
import { LogoutIcon, SettingIcon, UnlockIcon } from '@assets/icons';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown: React.FC<WithTranslation> = ({ t }) => {
	const { authStore } = useStore();
	const [open, setOpen] = useState<boolean>(false);
	const navigate = useNavigate();

	const onClick = (key: string): void => {
		setOpen(!open);
		switch (key) {
			case 'profile':
				navigate('/user/profile');
				break;
			case 'change_password':
				break;
			case 'logout':
				handleLogout();
				break;
			default:
				break;
		}
	};

	const handleLogout = (): void => {
		authStore.logout();
		navigate('/');
	};

	const content = (
		<div className="px-[6px] py-[8px]">
			<div className="flex justify-between items-start mb-4">
				<Avatar size={40} src={authStore.user?.avatar?.thumb_image_url} />
				<div className="grow ml-2 mr-4">
					<p className="text-primary">{authStore.user?.user_name}</p>
					<p className="text-secondary">{authStore.user?.email}</p>
				</div>
				<Tag color="#4DDC7F">{t(authStore.user?.subscription?.product_name || '')}</Tag>
			</div>
			<Divider className="m-0" />
			<div className="menu-primary">
				<div
					className="flex items-center py-4 px-2 menu-item cursor-pointer"
					onClick={() => onClick('profile')}
				>
					<SettingIcon />
					<span className="ml-[18px]">{t('profile')}</span>
				</div>
				<Divider className="m-0" />
				<div
					className="flex items-center py-4 px-2 menu-item cursor-pointer"
					onClick={() => onClick('change_password')}
				>
					<UnlockIcon />
					<span className="ml-[18px]">{t('change_password')}</span>
				</div>
				<Divider className="m-0" />
				<div className="flex items-center py-4 px-2 menu-item cursor-pointer" onClick={() => onClick('logout')}>
					<LogoutIcon />
					<span className="ml-[18px]">{t('logout')}</span>
				</div>
			</div>
		</div>
	);

	return (
		<>
			<Popover
				getPopupContainer={(trigger: HTMLElement) => trigger.parentElement as HTMLElement}
				rootClassName="px-4"
				open={open}
				onOpenChange={() => setOpen(!open)}
				trigger="click"
				placement="bottom"
				content={content}
				arrow={false}
			>
				<div className="cursor-pointer h-full">
					<Avatar style={{ border: 0 }} size={40} src={authStore.user?.avatar?.thumb_image_url} />
				</div>
			</Popover>
		</>
	);
};

export default withTranslation()(ProfileDropdown);
