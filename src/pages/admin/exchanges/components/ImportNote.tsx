import { Button, Input, Tooltip } from 'antd';
import React, { memo, useState } from 'react';
import { CopyOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const ImportNote: React.FC = () => {
	const { t } = useTranslation();
	const [copied, setCopied] = useState<boolean>(false);

	const copyClipboard = () => {
		navigator.clipboard.writeText('0.0.0.0'.replaceAll(',', ' ')).then();
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	return (
		<div className="flex flex-col mr-[9px]">
			<p className="font-medium mb-2 mt-8 text-primary">{t('important_note')}</p>
			<p className="text-secondary text-[14px]">{t('important_note_desc')}</p>
			<div className="w-full md:w-6/12 flex space-x-2 mt-2">
				<Input disabled type="text" value="0.0.0.0" id="referrals" className="w-full h-[40px]" />
				<Tooltip placement="top" title={t('copied')} open={copied}>
					<Button icon={<CopyOutlined />} onClick={copyClipboard} className="ml-auto" disabled={false} />
				</Tooltip>
			</div>
		</div>
	);
};

export default memo(ImportNote);
