import React, { useState } from 'react';
import { Input, Upload, UploadProps } from 'antd';
import type { UploadFile as AntdFile } from 'antd';
import { Toasts } from '@components/toasts';

interface UploadFileCustomProps extends UploadProps {
	typeFile: string;
}

const UploadFileCustom: React.FC<UploadFileCustomProps> = ({ typeFile, ...props }) => {
	const [files, setFiles] = useState<AntdFile[] | undefined>(props.fileList);

	const beforeUpload = (file: AntdFile, fileList: AntdFile[]) => {
		const isValidType = file.type?.startsWith(typeFile) || false;
		const isPdf = file.type === 'application/pdf';
		const isSizeValid = file.size && file.size <= 8 * 1024 * 1024;

		if (!isSizeValid) {
			Toasts.error('File size must be 8MB or smaller!');
			return Upload.LIST_IGNORE;
		}

		if (!isValidType && !isPdf) {
			Toasts.error(`You can only upload image files in the following formats: JPG, JPEG, PNG, and PDF.`);
			return Upload.LIST_IGNORE;
		}

		setFiles(fileList);
		return false;
	};

	const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
		setFiles(newFileList);
	};

	return (
		<Upload onChange={onChange} {...props} beforeUpload={beforeUpload} fileList={files}>
			<Input
				className="cursor-pointer"
				size="large"
				variant="filled"
				readOnly
				value={files ? files.map((file) => file.name).join(', ') : ''}
				placeholder="Upload a file"
				addonAfter={<span>Choose File</span>}
			/>
		</Upload>
	);
};

export { UploadFileCustom };
