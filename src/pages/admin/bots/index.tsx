import React, { useEffect, useMemo, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Button, Select, Input, Table, Tooltip, Popover, Divider, Tag, Dropdown, Flex, TableProps } from 'antd';
import { CloseOutlined, InfoCircleOutlined, MoreOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useThemeContext } from '@providers/ThemeProvider';
import { useStore } from '@providers/AppProvider';
import { Bot, Exchange } from '@types';
import { useMediaQuery } from 'react-responsive';
import {
	BOT_ACTIONS,
	BOT_STATUS_LIST,
	capitalizeFirstLetter,
	handleGetExchangeLogo,
	matchBotStatusLabel,
	renderDateTimeTable,
	uppercaseFirstLetter,
} from '@utils';
import { useNavigate } from 'react-router-dom';
import { Link, Text } from '@components/text';
import { BotStatusLabel, ExchangeButton } from '@components/buttons';
import {
	DeleteIcon,
	DuplicateIcon,
	FilterICon,
	ImportIcon,
	PauseIcon,
	StartIcon,
	StopIcon,
	ViewDetailIcon,
} from '@assets/icons';
import { mockBotsData } from '@mockdata/bots';
import { mockExchanges } from '@mockdata/exchanges';
import CustomPagination from '@components/pagination';
import Loading from '@components/loading';
import CardItem from '@pages/admin/bots/components/CardItem';

const ACTION_PLACEHOLDER = '-----------------';
const ACTION_PLACEHOLDER_MOBILE = '-----------------------------';

const STATUS_FILTER: { label: string, value: string }[] = [
	{ label: 'all', value: 'all' },
	{ label: 'on', value: 'on' },
	{ label: 'off', value: 'off' },
	{ label: 'pause', value: 'pause' },
];

// Interfaces
interface Filter {
	ordering: string;
	search?: string;
	exchange?: string;
	mode?: string;
	status?: string;
	exchange_name?: string;
}

type BotListProps = WithTranslation;

const BotList: React.FC<BotListProps> = ({ t }) => {
	const { stateStore } = useStore();
	const { typeTheme } = useThemeContext();
	const [bots, setBots] = useState<Bot[]>([]);
	const [exchanges, setExchanges] = useState<Exchange[]>([]);
	const [filter, setFilter] = useState<Filter>({ ordering: '-profit' });
	const [clearFilter, setClearFilter] = useState<boolean>(false);
	const [filterVisible, setFilterVisible] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [botName, setBotName] = useState<string | undefined>();
	const [loading, setLoading] = useState<boolean>(true);
	const isMobile = useMediaQuery({ maxWidth: '768px' }) as boolean;
	const pageSize = useMemo<number>(() => (isMobile ? 5 : 10), [isMobile]);
	const navigate = useNavigate();

	const columns = useMemo<TableProps<Bot>['columns']>(
		() => [
			{
				key: 'name',
				title: <span className="text-table-header">{t('name')}</span>,
				dataIndex: 'name',
				width: 240,
				render: (name: string, { my_exchange, id }: Bot) => (
					<div className="flex gap-2 items-center" onClick={() => navigate(`/bots/my-bot/detail/${id}`)}>
						<img className="w-[18px] mr-2" src={handleGetExchangeLogo(my_exchange?.exchange_code)} alt="" />
						<div>
							<span className="text-primary text-[14px]">{name}</span>
							<p className="text-[12px] text-[#A5ADCF]">{t('volatility_bot')}</p>
						</div>
					</div>
				),
				sorter: true,
				sortOrder: filter.ordering === '-name' ? 'descend' : filter.ordering === 'name' ? 'ascend' : null,
				fixed: !isMobile ? ('left' as const) : undefined,
			},
			{
				key: 'my_exchange',
				title: <span className="text-table-header">{t('exchange')}</span>,
				dataIndex: 'my_exchange',
				width: 300,
				render: (my_exchange: Bot['my_exchange']) => (
					<Flex gap={2} justify="space-between" align="center">
						<Link to={`exchanges/${my_exchange?.id}`}>{my_exchange?.name}</Link>
						<ExchangeButton>{capitalizeFirstLetter(my_exchange?.exchange_mode)}</ExchangeButton>
					</Flex>
				),
				sorter: true,
				sortOrder:
					filter.ordering === '-test_mode' ? 'descend' : filter.ordering === 'test_mode' ? 'ascend' : null,
			},
			{
				key: 'profit',
				title: <span className="text-table-header">{t('session_profit')}</span>,
				dataIndex: 'profit',
				width: 160,
				render: (profit: number, { est, my_exchange }: Bot) => (
					<div className="text-table-body text-[12px]">
						<span
							className={`font-semibold ${
								profit > 0 ? 'text-[#11CABE]' : profit < 0 ? 'text-red-01' : 'text-secondary'
							}`}
						>
							{`${profit}%`}
						</span>
						<p>{stateStore.getCurrency(est || 0, my_exchange?.exchange_code)}</p>
					</div>
				),
				sorter: true,
				sortOrder: filter.ordering === 'profit' ? 'ascend' : filter.ordering === '-profit' ? 'descend' : null,
			},
			{
				key: 'daily_pnl_percent',
				title: <span className="text-table-header">{t('daily_profit')}</span>,
				dataIndex: 'daily_pnl_percent',
				width: 160,
				render: (daily_pnl_percent: string, { daily_pnl_est, my_exchange }: Bot) => (
					<div className="text-table-body text-[12px]">
						<span
							className={`font-semibold ${
								parseFloat(daily_pnl_percent) > 0
									? 'text-[#11CABE]'
									: parseFloat(daily_pnl_percent) < 0
										? 'text-red-01'
										: 'text-secondary'
							}`}
						>
							{`${daily_pnl_percent}%`}
						</span>
						<p>{stateStore.getCurrency(daily_pnl_est, my_exchange?.exchange_code)}</p>
					</div>
				),
				sorter: true,
				sortOrder:
					filter.ordering === '-daily_pnl_percent'
						? 'descend'
						: filter.ordering === 'daily_pnl_percent'
							? 'ascend'
							: null,
			},
			{
				key: 'created',
				title: (
					<Tooltip color={typeTheme === 'dark' ? '#1E1F25' : '#FFFFFF'} title="UTC">
						<div className="flex gap-2 items-center text-table-header">
							<span>{t('created')}</span> <InfoCircleOutlined />
						</div>
					</Tooltip>
				),
				width: 150,
				dataIndex: 'created',
				render: (created: string) => <p className="text-primary text-[14px]">{renderDateTimeTable(created)}</p>,
				sorter: true,
				sortOrder: filter.ordering === '-created' ? 'descend' : filter.ordering === 'created' ? 'ascend' : null,
			},
			{
				key: 'actions',
				title: <span className="text-table-header">{t('actions')}</span>,
				dataIndex: 'actions',
				width: 140,
				render: (
					_: any,
					{ id, status, est, profit, est_no_holdings, profit_no_holdings, my_exchange }: Bot
				) => {
					const labelConfigs = matchBotStatusLabel(status);
					let filteredActions: any = actions
						.filter((action) => !action.forList)
						.map(({ value, label, icon }) => {
							if (status === BOT_STATUS_LIST.on && value === BOT_ACTIONS.start) return null;
							if (status === BOT_STATUS_LIST.deleting && value === BOT_ACTIONS.delete) return null;
							if (
								BOT_STATUS_LIST.off === status &&
								[BOT_ACTIONS.pause, BOT_ACTIONS.stop].indexOf(value) > -1
							)
								return null;
							if (BOT_STATUS_LIST.pause === status && value === BOT_ACTIONS.pause) return null;

							const data = { id, est, profit, est_no_holdings, profit_no_holdings, my_exchange, status };
							return {
								label: (
									<Flex
										key={value}
										className="gap-2 items-center"
										onClick={() => onClickActionBot(value, data)}
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
							<Dropdown
								menu={{ items: filteredActions }}
								overlayStyle={{ minWidth: 164 }}
								trigger={['click']}
							>
								<MoreOutlined />
							</Dropdown>
						</div>
					);
				},
				sorter: false,
			},
		],
		[bots, typeTheme, total, filter.ordering, isMobile, t]
	);

	const onClickActionBot = (action: string, data: Partial<Bot>) => {
		const { id } = data;
		switch (action) {
			case BOT_ACTIONS.detail:
				navigate(`/bots/my-bot/detail/${id}`);
				break;
			case BOT_ACTIONS.delete:
				break;
			case BOT_ACTIONS.start:
				break;
			case BOT_ACTIONS.stop:
				break;
			case BOT_ACTIONS.pause:
				break;
			case BOT_ACTIONS.duplicate:
				console.log(`/bots/my-bot/duplicate/${id}`);
				break;
			default:
				break;
		}
	};

	const loadBots = (page: number, ordering?: string) => {
		const data = {
			search: filter.search || undefined,
			exchange: filter.exchange !== 'all' ? filter.exchange : undefined,
			mode: filter.mode !== 'all' ? filter.mode : undefined,
			status: filter.status !== 'all' ? filter.status : undefined,
			limit: pageSize,
			offset: (page - 1) * pageSize,
			ordering: ordering || filter.ordering,
		};
		if (!data.ordering.includes('created')) {
			data.ordering = `${data.ordering},-created`;
		}
		setLoading(true);
		setTotal(mockBotsData.length);
		setBots(mockBotsData);
		setLoading(false);
	};

	useEffect(() => {
		setExchanges(mockExchanges);
	}, []);

	useEffect(() => {
		loadBots(currentPage, filter.ordering);
	}, [filter, currentPage]);

	const handleSearchMobile = () => {
		setFilterVisible(false);
		setCurrentPage(1);
	};

	const getFilterView = () => (
		<div className={`${isMobile ? '' : '[&>*]:max-w-[164px]'} md:flex`}>
			<Input
				className="mb-2 md:mr-2 md:mb-0 xl:min-w-[150px]"
				value={botName}
				placeholder={t('bot_name')}
				prefix={<SearchOutlined />}
				onChange={(e) => setBotName(e.target.value)}
				onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
					if (e.target.value !== filter.search) {
						setFilter({ ...filter, search: e.target.value });
					}
				}}
				onPressEnter={(e: React.KeyboardEvent<HTMLInputElement>) =>
					setFilter({ ...filter, search: e.currentTarget.value })
				}
				data-qa="bot-filter-name-input"
			/>
			<Select
				className="w-full md:min-w-[150px] mb-2 md:mr-2 md:mb-0"
				placeholder={t('my_exchange')}
				value={filter.exchange}
				allowClear
				onClear={() => setFilter({ ...filter, exchange: undefined, exchange_name: undefined })}
				notFoundContent={null}
				onChange={(value: string | undefined, item: any) =>
					setFilter({ ...filter, exchange: value, exchange_name: item?.name })
				}
				data-qa="bot-filter-exchange-select"
				popupClassName="bot-filter-exchange-select md:min-w-[400px] lg:min-w-[400px]"
				showSearch
				filterOption={(input: string, option?: { name?: string }) =>
					option?.name?.toLowerCase().includes(input.toLowerCase()) || false
				}
				options={exchanges.map(({ id, name, exchange, mode }) => ({
					value: id,
					name,
					label: (
						<div key={id} className="flex items-center w-full">
							<img className="w-[18px] mr-2" src={handleGetExchangeLogo(exchange)} alt="Exchange Image" />
							<div className="overflow-hidden whitespace-nowrap text-ellipsis inline-block mr-1">
								{name}
							</div>
							<Tag>{uppercaseFirstLetter(mode)}</Tag>
						</div>
					),
				}))}
			/>
			<Select
				className="w-full md:min-w-[150px] mb-2 md:mr-2 md:mb-0"
				placeholder={t('status')}
				value={filter.status}
				onChange={(status: string) => setFilter({ ...filter, status })}
				data-qa="bot-filter-status-select"
				popupClassName="bot-filter-status-select"
				options={STATUS_FILTER.map(({ label, value }) => ({ label: t(label).toUpperCase(), value }))}
			/>
			<Button
				className="lg:!hidden button-primary w-full text-[12px]"
				type="primary"
				onClick={handleSearchMobile}
			>
				{t('apply')}
			</Button>
		</div>
	);

	const actions = [
		{
			value: '',
			label: !isMobile ? ACTION_PLACEHOLDER : ACTION_PLACEHOLDER_MOBILE,
			forList: true,
		},
		{ value: BOT_ACTIONS.detail, label: t('detail'), forDetail: true, icon: <ViewDetailIcon /> },
		{ value: BOT_ACTIONS.duplicate, label: t('Duplicate'), forDetail: true, icon: <DuplicateIcon /> },
		{ value: BOT_ACTIONS.start, label: t('start_bot'), icon: <StartIcon /> },
		{ value: BOT_ACTIONS.pause, label: t('pause'), icon: <PauseIcon /> },
		{ value: BOT_ACTIONS.stop, label: t('stop'), icon: <StopIcon /> },
		{ value: BOT_ACTIONS.delete, label: t('delete'), icon: <DeleteIcon /> },
	];

	const renderTable = () => (
		<div className="card-primary rounded-[8px] pt-0">
			<div className="min-h-[120px] mb-4 relative">
				<Table
					loading={loading}
					columns={columns}
					dataSource={bots}
					rowKey="id"
					scroll={{ x: 1200 }}
					showSorterTooltip={false}
					locale={{
						emptyText: t('no_bot'),
						triggerDesc: t('trigger_desc'),
						triggerAsc: t('trigger_asc'),
						cancelSort: t('cancel_sort'),
					}}
					onChange={(_, __, sorter) => {
						if (sorter && 'columnKey' in sorter && typeof sorter.columnKey === 'string') {
							let { ordering } = filter;
							if (ordering.includes(sorter.columnKey)) {
								ordering = ordering.startsWith('-') ? sorter.columnKey : `-${sorter.columnKey}`;
							} else {
								ordering = sorter.columnKey;
							}
							setFilter({ ...filter, ordering });
						}
					}}
					rowClassName="cursor-pointer [&>.ant-table-cell]:py-2"
					pagination={false}
					data-qa="bots-table"
				/>
			</div>
			<CustomPagination
				total={total}
				currentPage={currentPage}
				pageSize={pageSize}
				onChange={(page: number) => setCurrentPage(page)}
			/>
		</div>
	);

	const renderCardItem = () => (
		<>
			{!loading ? (
				bots.map((item) => <CardItem key={item.id} dataItem={item} />)
			) : (
				<div className="flex items-center justify-center h-full w-full">
					<Loading />
				</div>
			)}
			<CustomPagination
				className=""
				total={total}
				currentPage={currentPage}
				pageSize={pageSize}
				onChange={(page: number) => setCurrentPage(page)}
			/>
		</>
	);

	return (
		<div className="px-4 md:px-8">
			<div className={`${isMobile ? 'flex-col-reverse ' : ''} flex justify-between gap-4`}>
				<div className="hidden lg:block mb-4">{getFilterView()}</div>
				<div className="hidden lg:block md:justify-end justify-start mb-4">
					<Button
						className="button-primary flex items-center w-full md:w-auto text-[12px]"
						type="primary"
						icon={<PlusOutlined />}
					>
						{t('add_new_bot')}
					</Button>
				</div>
				{isMobile && (
					<div className="lg:hidden mb-4 w-full lg:w-0">
						<Popover
							getPopupContainer={(trigger) => trigger.parentElement as HTMLElement}
							rootClassName="pt-4 px-4"
							title={
								<div>
									<div className="inline-flex items-center text-primary font-medium text-[16px] space-x-3">
										<button
											className="w-[24px] h-[24px]"
											onClick={() => {
												setFilterVisible(!filterVisible);
												setFilter({ ordering: '-profit' });
												setClearFilter(!clearFilter);
												setCurrentPage(1);
											}}
										>
											<CloseOutlined />
										</button>
										<p>{t('Filter')}</p>
									</div>
									<Divider className="m-0 my-3" />
								</div>
							}
							placement="bottom"
							arrow={false}
							content={getFilterView()}
							open={filterVisible}
							trigger={['click']}
						>
							<div className="flex justify-between items-center gap-3">
								<div className="flex-1 flex flex-wrap items-center">
									<div className="mr-2 text-secondary text-[14px]">{t('filter_by')}:</div>
									{filter.search && (
										<div className="card-secondary px-[12px] py-[4px] mr-2 my-1 text-[12px]">
											<span className="text-secondary">{t('bot_name')}</span>:{' '}
											<span className="text-primary">{filter.search}</span>
										</div>
									)}
									{filter.exchange && filter.exchange_name && (
										<div className="card-secondary px-[12px] py-[4px] mr-2 my-1 text-[12px]">
											<span className="text-secondary">{t('exchange')}</span>:{' '}
											<span className="text-primary">{filter.exchange_name}</span>
										</div>
									)}
									{filter.mode && filter.mode !== 'all' && (
										<div className="card-secondary px-[12px] py-[4px] mr-2 my-1 text-[12px]">
											<span className="text-secondary">{t('mode')}</span>:{' '}
											<span className="text-primary">
												{filter.mode === '1' ? t('test') : t('real')}
											</span>
										</div>
									)}
									{filter.status && filter.status !== 'all' && (
										<div className="card-secondary px-[12px] py-[4px] mr-2 my-1 text-[12px]">
											<span className="text-secondary">{t('status')}</span>:{' '}
											<span className="text-primary">{filter.status.toUpperCase()}</span>
										</div>
									)}
									{(!filter.exchange || filter.exchange === '') &&
										(!filter.status || filter.status === 'all') &&
										(!filter.search || filter.search === '') &&
										(!filter.mode || filter.mode === 'all') && (
											<div className="card-secondary px-[12px] py-[4px] text-[12px]">
												<span className="text-primary">{t('all')}</span>
											</div>
										)}
								</div>
								<Button
									className="button-primary-outline--default"
									icon={<FilterICon color={typeTheme === 'dark' ? '#ffffff' : '#8188A9'} />}
									onClick={() => setFilterVisible(!filterVisible)}
								/>
							</div>
						</Popover>
					</div>
				)}
			</div>
			{!isMobile ? renderTable() : renderCardItem()}
			{isMobile && (
				<div className="flex flex-row justify-between gap-4 mt-4">
					<Button className="button-primary flex gap-2 flex-1">
						{t('export')}
						<ImportIcon width={16} height={16} />
					</Button>
				</div>
			)}
		</div>
	);
};

export default withTranslation()(BotList);
