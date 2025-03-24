import React, { useState, useEffect, useMemo } from 'react';
import { Select, Table, Tooltip, DatePicker, Button, Popover, Divider, ConfigProvider, TableProps } from 'antd';
import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { withTranslation, WithTranslation } from 'react-i18next';
import CardItem from '../components/CardItem';
import { Dayjs } from 'dayjs';
import { Transaction } from '@types';
import { useThemeContext } from '@providers/ThemeProvider';
import { useStore } from '@providers/AppProvider';
import { useMediaQuery } from 'react-responsive';
import { handleGetExchangeLogo, renderDateTimeTable } from '@utils';
import { mockTransactions } from '@mockdata/transactions';
import { panelRender } from '@components/datepicker/WrapperDatePicker';
import Loading from '@components/loading';
import { DownloadOutlinedIcon, FilterICon } from '@assets/icons';
import CustomPagination from '@components/pagination';
import { mockBotsData } from '@mockdata/bots';

const { Option } = Select;
const { RangePicker } = DatePicker;

// Interfaces
interface Filter {
	ordering: string;
	bot_id?: string;
	side?: string;
	base?: string;
	quote?: string;
	order_type?: string;
	time_range?: any;
}

type OrderHistoryProps = WithTranslation;

const OrderHistory: React.FC<OrderHistoryProps> = ({ t }) => {
	const { stateStore } = useStore();
	const [filterVisible, setFilterVisible] = useState<boolean>(false);
	const [filter, setFilter] = useState<Filter>({
		ordering: '-created',
	});
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(true);
	const isXl = useMediaQuery({ minWidth: '1280px' }) as boolean;
	const isMobile = useMediaQuery({ maxWidth: '640px' }) as boolean;
	const pageSize = useMemo<number>(() => (isMobile ? 5 : 10), [isMobile]);

	const columns = useMemo<TableProps<Transaction>['columns']>(
		() => [
			{
				key: 'coin',
				title: <span className="text-table-header">{t('coin')}</span>,
				dataIndex: 'coin',
				render: (coin: string) => <span className="text-table-body">{coin}</span>,
				sorter: true,
				sortOrder: filter.ordering === '-coin' ? 'descend' : filter.ordering === 'coin' ? 'ascend' : null,
			},
			{
				key: 'bot',
				title: <span className="text-table-header">{t('bot')}</span>,
				dataIndex: 'bot_name',
				render: (bot_name: string) => <span className="text-table-body">{bot_name}</span>,
				sorter: true,
				sortOrder: filter.ordering === '-bot' ? 'descend' : filter.ordering === 'bot' ? 'ascend' : null,
			},
			{
				key: 'side',
				title: <span className="text-table-header">{t('side')}</span>,
				dataIndex: 'side',
				render: (side: 'BUY' | 'SELL') => (
					<span
						className={`${
							side === 'SELL' ? 'text-[#FA2256]' : 'text-[#30E0A1]'
						} font-semibold text-table-body`}
					>
						{t(side.toLowerCase()).toUpperCase()}
					</span>
				),
				sorter: true,
				sortOrder: filter.ordering === '-side' ? 'descend' : filter.ordering === 'side' ? 'ascend' : null,
			},
			{
				key: 'executed_qty',
				title: <span className="text-table-header">{t('Executed')}</span>,
				dataIndex: 'executed_qty',
				render: (executed_qty: string) => <span className="text-table-body">{executed_qty}</span>,
				sorter: true,
				sortOrder:
					filter.ordering === '-executed_qty'
						? 'descend'
						: filter.ordering === 'executed_qty'
							? 'ascend'
							: null,
			},
			{
				key: 'price',
				title: <span className="text-table-header">{t('price')}</span>,
				dataIndex: 'price',
				width: 150,
				render: (price: string) => <span className="text-table-body">{parseFloat(price)}</span>,
				sorter: true,
				sortOrder: filter.ordering === '-price' ? 'descend' : filter.ordering === 'price' ? 'ascend' : null,
			},
			{
				key: 'profit',
				title: <span className="text-table-header">{t('profit')}</span>,
				dataIndex: 'profit',
				render: (profit: number, { side, est, exchange_code }: Transaction) => (
					<div className="flex flex-col text-table-body">
						{side === 'SELL' ? (
							<>
								<span
									className={
										profit > 0
											? 'text-green-02 text-[12px]'
											: profit < 0
												? 'text-red-01 text-[12px]'
												: ''
									}
								>
									{`${profit > 0 ? '+' : '-'}${Math.abs(profit)}%`}
								</span>
								<span className="font-normal text-primary">
									≈ {stateStore.getCurrency(est || 0, exchange_code)}
								</span>
							</>
						) : (
							<span className="text-start">-</span>
						)}
					</div>
				),
				sorter: true,
				sortOrder: filter.ordering === '-profit' ? 'descend' : filter.ordering === 'profit' ? 'ascend' : null,
			},
			{
				key: 'fee_cost',
				title: <span className="text-table-header">{t('Trading fee')}</span>,
				dataIndex: 'fee_cost',
				width: 150,
				render: (fee: string, { fee_currency }: Transaction) => (
					<span className="text-table-body">
						{parseFloat(fee)} {fee_currency}
					</span>
				),
				sorter: true,
				sortOrder:
					filter.ordering === '-fee_cost' ? 'descend' : filter.ordering === 'fee_cost' ? 'ascend' : null,
			},
			{
				key: 'cost',
				title: <span className="text-table-header">{t('total')}</span>,
				dataIndex: 'cost',
				render: (total: string, { coin }: Transaction) => (
					<span className="text-table-body">
						{parseFloat(total)} {coin.split('/')[1] || 'USDT'}
					</span>
				),
				sorter: true,
				sortOrder: filter.ordering === '-cost' ? 'descend' : filter.ordering === 'cost' ? 'ascend' : null,
				width: '15%',
			},
			{
				key: 'created',
				title: (
					<Tooltip title="UTC">
						<div className="flex gap-2 items-center text-table-header">
							<span>{t('created')}</span> <InfoCircleOutlined />
						</div>
					</Tooltip>
				),
				dataIndex: 'created',
				render: (created: number) => (
					<p className="text-primary text-[14px]">{renderDateTimeTable(String(created))}</p>
				),
				sorter: true,
				sortOrder: filter.ordering === '-created' ? 'descend' : filter.ordering === 'created' ? 'ascend' : null,
				width: '15%',
			},
		],
		[filter]
	);

	const themeConfig = {
		components: {
			Select: {
				fontSize: 12,
				optionFontSize: 12,
			},
			DatePicker: {
				fontSize: 12,
				optionFontSize: 12,
			},
			Button: {
				fontSize: 12,
				optionFontSize: 12,
			},
		},
	};

	useEffect(() => {
		stateStore.setHeaderTitle(t('spot_orders'));
	}, []);

	const loadOrder = (page: number, ordering?: string) => {
		console.log(page, ordering);
		setLoading(true);
		setTotal(mockTransactions.length);
		setTransactions(mockTransactions);
		setLoading(false);
	};

	const handleSearchMobile = () => {
		setFilterVisible(false);
		loadOrder(1, filter.ordering);
	};

	useEffect(() => {
		if (!isMobile || Object.keys(filter).length === 1) {
			setCurrentPage(1);
			loadOrder(1, filter.ordering);
		}
		if (isMobile && Object.keys(filter).length > 1) {
			setCurrentPage(1);
			loadOrder(1, filter.ordering);
		}
	}, [filter, isMobile]);

	const searchCoin = (keyword: string) => {
		console.log(keyword);
	};

	const getFilterView = () => (
		<div className="md:flex gap-2 space-y-2 md:space-y-0">
			<Select
				className="w-full xl:w-[200px]"
				placeholder={t('bot')}
				value={filter.bot_id}
				onChange={(value: string) => setFilter({ ...filter, bot_id: value })}
				data-qa="transaction-bot-select"
				popupClassName="transaction-bot-select md:min-w-[400px] lg:min-w-[400px]"
				showSearch
				notFoundContent={null}
				filterOption={(input: string, option?: { children?: string }) =>
					option?.children?.toLowerCase().includes(input.toLowerCase()) || false
				}
				options={[
					{
						value: 'all',
						label: t('all'),
						children: 'all',
					},
					...mockBotsData.map((bot) => ({
						value: bot.id,
						children: bot.name,
						label: (
							<Tooltip
								title={bot.name}
								trigger={['hover']}
								open={bot.name?.length < 50 ? false : undefined}
								placement="topLeft"
							>
								<div className="flex items-center gap-2">
									<img
										className="w-[18px] "
										src={handleGetExchangeLogo(bot.my_exchange.exchange_code)}
										alt=""
									/>
									{bot.name}
								</div>
							</Tooltip>
						),
					})),
				]}
			/>
			<Select
				className="w-full xl:w-[120px]"
				placeholder={t('side')}
				value={filter.side}
				onChange={(side: string) => setFilter({ ...filter, side })}
				data-qa="transaction-side-select"
				popupClassName="transaction-side-select"
			>
				<Option value="all">{t('all')}</Option>
				<Option value="BUY">{t('buy')}</Option>
				<Option value="SELL">{t('sell')}</Option>
			</Select>
			<Select
				className="w-full xl:w-[120px]"
				placeholder={t('Quote')}
				showSearch
				notFoundContent={null}
				allowClear
				value={filter.quote}
				onSearch={searchCoin}
				options={[{ base: 'BTC' }].map(({ base }) => ({
					label: base,
					value: base,
				}))}
				onSelect={(quote: string) => setFilter({ ...filter, quote })}
				onClear={() => setFilter({ ...filter, quote: undefined })}
				data-qa="transaction-coin-input"
			/>
			<Select
				className="w-full xl:w-[120px]"
				placeholder={t('Base')}
				showSearch
				notFoundContent={null}
				allowClear
				value={filter.base}
				onSearch={searchCoin}
				options={[{ base: 'BTC' }].map(({ base }) => ({
					label: base,
					value: base,
				}))}
				onSelect={(base: string) => setFilter({ ...filter, base })}
				onClear={() => setFilter({ ...filter, base: undefined })}
				data-qa="transaction-coin-input"
			/>
			<RangePicker
				className="w-full xl:w-[240px]"
				popupClassName="w-screen md:w-fit"
				format="DD-MM-YYYY"
				placeholder={[t('From date'), t('To date')]}
				value={filter.time_range}
				onChange={(time_range) => setFilter({ ...filter, time_range })}
				disabledDate={(date: Dayjs) => date.unix() > Date.now() / 1000}
				panelRender={panelRender}
				getPopupContainer={(trigger) => trigger.parentElement as HTMLElement}
			/>
			<Button className="lg:!hidden button-primary w-full" type="primary" onClick={handleSearchMobile}>
				{t('apply')}
			</Button>
		</div>
	);

	const renderTable = () => (
		<Table
			loading={loading}
			columns={columns}
			dataSource={transactions}
			rowKey="id"
			scroll={isXl ? undefined : { x: 1000 }}
			showSorterTooltip={false}
			locale={{
				emptyText: t('no_transaction'),
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
			pagination={false}
			data-qa="coins-bought-table"
		/>
	);

	const renderCardItem = () => (
		<>
			{loading && (
				<div className="flex items-center justify-center h-full w-full">
					<Loading />
				</div>
			)}
			{!loading && transactions.map((item) => <CardItem key={item.id} dataItem={item} />)}
		</>
	);

	return (
		<ConfigProvider theme={themeConfig}>
			<div className="flex justify-between items-center gap-2">
				<div className="hidden lg:block mb-4">{getFilterView()}</div>
				<div className="mb-4 flex-1 flex md:justify-end justify-start">
					<Button
						className="button-primary flex items-center gap-[10px] font-semibold w-full md:w-auto"
						type="primary"
					>
						{t('Export')}
						<DownloadOutlinedIcon />
					</Button>
				</div>
				<div className="xl:hidden mb-4">
					<Popover
						getPopupContainer={(trigger) => trigger.parentElement as HTMLElement}
						rootClassName="pt-4 px-4"
						title={
							<div>
								<div className="inline-flex items-center text-primary font-medium text-[16px] space-x-3">
									<button
										className="w-[24px] h-[24px]"
										onClick={() => setFilterVisible(!filterVisible)}
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
						onOpenChange={(v: boolean) => setFilterVisible(v)}
						trigger={['click']}
					>
						<Button
							className={`bg-[#FFF] button-primary-outline--default`}
							icon={<FilterICon color={'#8188A9'} />}
						/>
					</Popover>
				</div>
			</div>
			{isMobile ? <Divider className="mb-4 mt-0" /> : null}
			<div className="min-h-[120px] relative">
				{!isMobile ? renderTable() : renderCardItem()}
				<CustomPagination
					className="mt-[26px]"
					total={total}
					currentPage={currentPage}
					pageSize={pageSize}
					onChange={(page: number) => {
						setCurrentPage(page);
						loadOrder(page, filter.ordering);
					}}
				/>
			</div>
		</ConfigProvider>
	);
};

export default withTranslation()(OrderHistory);
