import React from 'react';
import { Pagination } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';
import { useThemeContext } from '@providers/ThemeProvider';

// Interface for props
interface CustomPaginationProps extends WithTranslation {
	className?: string;
	total: number;
	currentPage: number;
	pageSize: number;
	showCounter?: boolean;
	onChange?: (page: number, pageSize?: number) => void;
	disabled?: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
	t,
	className,
	total,
	currentPage,
	pageSize,
	showCounter = true,
	onChange,
	disabled = false,
}) => {
	const { typeTheme } = useThemeContext();

	return (
		<div className={`${className || ''} md:flex md:justify-between md:items-center md:w-full`}>
			{showCounter && (
				<div
					className={`text-center mb-2 md:text-left md:mb-0 text-[14px] text-fourth ${
						typeTheme === 'dark' ? 'text-[#5D6589]' : 'text-[#58667E]'
					}`}
				>
					{total === 0
						? t('No Items')
						: t('paging_description', {
								from: Math.min((currentPage - 1) * pageSize + 1, total),
								to: Math.min(currentPage * pageSize, total),
								total,
							})}
				</div>
			)}

			<div className="flex justify-center md:justify-end">
				<Pagination
					total={total}
					current={currentPage}
					pageSize={pageSize}
					showLessItems
					showSizeChanger={false}
					onChange={(page: number, pageSize?: number) => !disabled && onChange?.(page, pageSize)}
					itemRender={(
						page: number,
						type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
						element: React.ReactNode
					) => {
						if (type === 'page' && page > 99) {
							return (
								<a className="text-[11px]" rel="nofollow">
									{page}
								</a>
							);
						}
						return element;
					}}
				/>
			</div>
		</div>
	);
};

export default withTranslation()(CustomPagination);
