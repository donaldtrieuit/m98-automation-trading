import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Button } from 'antd';
import styled from 'styled-components';
import { Typography } from 'antd';
import { useThemeContext } from '@providers/ThemeProvider';
import { Text } from '@components/text';

export { ButtonIconCore } from './ButtonIcon';
export { ButtonPrimary } from './ButtonPrimary';

// Extend Button props with WithTranslation for CancelButton
interface CancelButtonProps extends WithTranslation, React.ComponentProps<typeof Button> {}

// CancelButton component
export const CancelButton = withTranslation()(({ t, ...props }: CancelButtonProps) => (
	<Button className="button-primary-outline--default min-w-[84px]" {...props}>
		{t('cancel')}
	</Button>
));

// Extend Button props with WithTranslation and custom props for AcceptButton
interface AcceptButtonProps extends WithTranslation, React.ComponentProps<typeof Button> {
	children?: React.ReactNode; // Allow custom children
}

// AcceptButton component
export const AcceptButton = withTranslation()(({ t, className, children, ...props }: AcceptButtonProps) => (
	<Button {...props} className={`button-primary min-w-[84px] ${className || ''}`}>
		{children || t('ok')}
	</Button>
));

export const BotStatusLabel = styled(Text)`
	min-width: 100px;
	padding: 4px;
	border-radius: 6px;
	text-align: center;
	color: #fff;
`;

export const ExchangeButton = (props: any) => {
	const { typeTheme } = useThemeContext();

	return (
		<StyledExchangeButton style={{ backgroundColor: typeTheme === 'light' ? '#F6F8FB' : '#151619' }} {...props} />
	);
};

const StyledExchangeButton = styled(Typography)`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2px 4px;
	min-width: 97px;
	border-radius: 6px;
	white-space: nowrap;
	border: 1px solid #2f324140;
	text-align: center;
`;
