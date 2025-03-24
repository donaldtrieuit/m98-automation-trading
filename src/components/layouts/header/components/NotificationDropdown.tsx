import React, { useState } from 'react';
import { Badge, Popover } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';

import Notification from '@pages/admin/profile/components/Notification';
import { NotificationIcon } from '@assets//icons/NotificationIcon';

const NotificationDropdown: React.FC<WithTranslation> = () => {
	const [isOpened, setOpened] = useState<boolean>(false);
	return (
		<Popover
			getPopupContainer={(trigger: HTMLElement): HTMLElement => trigger.parentElement || document.body}
			rootClassName="pt-4 px-4 styledNotification"
			trigger="click"
			placement="bottom"
			content={<Notification />}
			onOpenChange={(open: boolean) => setOpened(open)}
			open={isOpened}
			arrow={false}
		>
			<Badge style={{ color: 'white' }} count={99}>
				<button className="border-none bg-transparent cursor-pointer">
					<NotificationIcon color="#34384C" />
				</button>
			</Badge>
		</Popover>
	);
};

export default withTranslation()(NotificationDropdown);
