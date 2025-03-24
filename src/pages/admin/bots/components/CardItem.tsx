import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Flex, Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { Bot } from '@types';
import { useThemeContext } from '@providers/ThemeProvider';
import { useStore } from '@providers/AppProvider';
import { Link, Text } from '@components/text';
import { BotStatusLabel, ExchangeButton } from '@components/buttons';
import {
	BOT_ACTIONS,
	BOT_STATUS_LIST,
	capitalizeFirstLetter,
	handleGetExchangeLogo,
	matchBotStatusLabel,
} from '@utils';
import { DeleteIcon, DuplicateIcon, PauseIcon, StartIcon, StopIcon, ViewDetailIcon } from '@assets/icons';

// Interfaces
interface InfoItem {
	label: string;
	itemRender: React.ReactNode;
	id: string;
}

interface CardItemProps extends WithTranslation {
	dataItem: Bot;
	onClickActionBot?: (action: string, data: Partial<Bot>) => void;
}

const CardItem: React.FC<CardItemProps> = ({ dataItem, onClickActionBot, t }) => {
	const {
		id,
		name,
		my_exchange,
		profit,
		est,
		daily_pnl_percent,
		daily_pnl_est,
		created,
		status,
		est_no_holdings,
		profit_no_holdings,
	} = dataItem;
	const { stateStore } = useStore();
	const { typeTheme } = useThemeContext();

	const renderName = () => (
		<div className="flex items-center">
			<img className="w-[18px] mr-2" src={handleGetExchangeLogo(my_exchange?.exchange_code)} alt="" />
			<span className="text-primary text-[14px]">{name}</span>
		</div>
	);

	const renderExchange = () => (
		<div className="flex flex-row items-center gap-1">
			<Link to={`exchanges/${my_exchange?.id}`}>{my_exchange?.name}</Link>
			<ExchangeButton className="min-w-[70px] h-[21px]">
				{capitalizeFirstLetter(my_exchange?.exchange_mode)}
			</ExchangeButton>
		</div>
	);

	const renderSessionPNL = () => (
		<div className="text-table-body text-[12px]">
			<span
				className={`font-semibold ${
					profit > 0 ? 'text-[#11CABE]' : profit < 0 ? 'text-red-01' : 'text-secondary'
				}`}
			>
				{`${profit}%`}
			</span>{' '}
			<span>{stateStore.getCurrency(est || 0, my_exchange?.exchange_code)}</span>
		</div>
	);

	const renderDailyPNL = () => (
		<div className="text-table-body text-[12px]">
			<span
				className={`font-semibold ${
					daily_pnl_percent > 0 ? 'text-[#11CABE]' : daily_pnl_percent < 0 ? 'text-red-01' : 'text-secondary'
				}`}
			>
				{`${daily_pnl_percent}%`}
			</span>{' '}
			<span>{stateStore.getCurrency(daily_pnl_est, my_exchange?.exchange_code)}</span>
		</div>
	);

	const renderDateTimeTable = (timestamp: string) => {
		const dateFormat = dayjs.tz(parseInt(timestamp) * 1000).format('DD/MM/YYYY HH:mm:ss');
		return <span className="text-primary text-[12px]">{dateFormat}</span>;
	};

	const renderCreatedTime = () => renderDateTimeTable(created);

	const actions = [
		{ value: BOT_ACTIONS.detail, label: t('detail'), forDetail: true, icon: <ViewDetailIcon /> },
		{ value: BOT_ACTIONS.duplicate, label: t('Duplicate'), forDetail: true, icon: <DuplicateIcon /> },
		{ value: BOT_ACTIONS.start, label: t('start_bot'), icon: <StartIcon /> },
		{ value: BOT_ACTIONS.pause, label: t('pause'), icon: <PauseIcon /> },
		{ value: BOT_ACTIONS.stop, label: t('stop'), icon: <StopIcon /> },
		{ value: BOT_ACTIONS.delete, label: t('delete'), icon: <DeleteIcon /> },
	];

	const renderActions = () => {
		const labelConfigs = matchBotStatusLabel(status);
		let filteredActions: any = actions
			.map(({ value, label, icon }) => {
				if (status === BOT_STATUS_LIST.on && value === BOT_ACTIONS.start) return null;
				if (status === BOT_STATUS_LIST.deleting && value === BOT_ACTIONS.delete) return null;
				if (BOT_STATUS_LIST.off === status && [BOT_ACTIONS.pause, BOT_ACTIONS.stop].includes(value))
					return null;
				if (BOT_STATUS_LIST.pause === status && value === BOT_ACTIONS.pause) return null;

				const data: Partial<Bot> = {
					id,
					est,
					profit,
					est_no_holdings,
					profit_no_holdings,
					my_exchange,
					status,
				};
				return {
					label: (
						<Flex
							key={value}
							className="gap-2 items-center"
							onClick={() => (onClickActionBot ? onClickActionBot(value, data) : {})}
						>
							{icon}
							<Text>{label}</Text>
						</Flex>
					),
					key: value,
				};
			})
			.filter(Boolean) as { label: React.ReactNode, key: string }[];

		filteredActions = filteredActions.flatMap((action: any, idx: number) =>
			idx < filteredActions.length - 1
				? [
						action,
						{
							type: 'divider' as const,
							dashed: true,
							style: {
								backgroundColor: `${typeTheme === 'light' ? '#6D5CDA24' : '#31314A'}`,
							},
						},
					]
				: [action]
		);

		return (
			<div className="flex items-center space-x-2">
				<BotStatusLabel style={{ backgroundColor: labelConfigs.bgColor }}>
					{t(labelConfigs.label)}
				</BotStatusLabel>
				<Dropdown menu={{ items: filteredActions }} overlayStyle={{ minWidth: 164 }} trigger={['click']}>
					<MoreOutlined />
				</Dropdown>
			</div>
		);
	};

	const infoItem: InfoItem[] = [
		{ label: 'name', itemRender: renderName(), id: 'name' },
		{ label: 'exchange', itemRender: renderExchange(), id: 'exchange' },
		{ label: 'session_profit', itemRender: renderSessionPNL(), id: 'sessionPNL' },
		{ label: 'daily_profit', itemRender: renderDailyPNL(), id: 'dailyPNL' },
		{ label: 'created', itemRender: renderCreatedTime(), id: 'createdTime' },
		{ label: 'actions', itemRender: renderActions(), id: 'actions' },
	];

	return (
		<div key={id} className="card-primary rounded-[8px] gap-4 mb-4 flex flex-col text-[14px]">
			{infoItem.map((i) => (
				<div className="flex flex-row items-center justify-between" key={i.id}>
					<p>{t(i.label)}</p>
					{i.itemRender}
				</div>
			))}
		</div>
	);
};

export default withTranslation()(CardItem);
