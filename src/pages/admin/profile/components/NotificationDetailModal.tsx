import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Button, Modal } from 'antd';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import { Converter } from 'showdown';
import { Notification } from '@types';

// Initialize markdown converter
const markdownConverter = new Converter({ moreStyling: true, literalMidWordUnderscores: true });

// Add timezone plugin to dayjs
dayjs.extend(tz);

interface NotificationDetailModalProps extends WithTranslation {
	open: boolean;
	notification: Notification;
	onClose: () => void;
}

const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({ t, open, notification, onClose }) => (
	<Modal
		className="[&>.ant-modal-content]:rounded-lg"
		width={640}
		open={open}
		onCancel={onClose}
		footer={null}
		zIndex={99999}
	>
		<div className="text-center text-lg font-medium">{t('Notification Detail')}</div>
		<div className="mt-4">
			<p className="font-medium text-lg">{notification.verb}</p>
			<span className="text-xs opacity-80">
				{dayjs.tz(parseInt(notification.timestamp) * 1000).format('DD-MM-YYYY HH:mm:ss')}
			</span>
		</div>
		<div className="mt-4">
			<div
				className="opacity-80"
				dangerouslySetInnerHTML={{
					__html: markdownConverter.makeHtml(notification.description),
				}}
			/>
		</div>
		<div className="flex justify-end mt-4">
			<Button className="px-8 hover:border-transparent flex-none button-primary" onClick={onClose}>
				<span className="text-white">{t('close')}</span>
			</Button>
		</div>
	</Modal>
);

export default withTranslation()(NotificationDetailModal);
