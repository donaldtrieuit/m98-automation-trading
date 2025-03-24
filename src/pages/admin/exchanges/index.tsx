import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Select, Input, Button, Form, ConfigProvider, Popover, Divider, InputRef } from 'antd';
import { useTranslation } from 'react-i18next';
import { CloseOutlined, PlusOutlined, SearchOutlined, CloseCircleFilled } from '@ant-design/icons';
import MyWalletsSlider from './components/MyWalletsSlider';
import { useMediaQuery } from 'react-responsive';
import { useStore } from '@providers/AppProvider';
import { useThemeContext } from '@providers/ThemeProvider';
import { Exchange } from '@types';
import { themeObject } from '../../../styles/themes/themeVariables';
import { mockExchanges, mockSupportMyExchangeData } from '@mockdata/exchanges';
import { handleGetExchangeLogo, MARKET_MODE, MARKET_MODE_OPTS } from '@utils';
import Loading from '@components/loading';
import { FilterICon } from '@assets/icons';
import { CancelButton } from '@components/buttons';
import SupportExchanges from '@pages/admin/exchanges/components/SupportExchanges';
import ImportNote from '@pages/admin/exchanges/components/ImportNote';

const { Option } = Select;

// Interfaces
interface Filter {
	offset: number;
	limit: number;
	name?: string;
	exchange_code?: string;
	mode?: string;
}

interface SupportExchange {
	code: string;
	mode: string;
	name: string;
	referLink?: string;
}

const MyWallets: React.FC = () => {
	const { t } = useTranslation();
	const { search } = useLocation();
	const navigate = useNavigate();
	const query = useMemo(() => new URLSearchParams(search), [search]);
	const isDesktop = useMediaQuery({ minWidth: '1280px' });
	const pageSize = isDesktop ? 8 : 3;
	const { stateStore } = useStore();
	const { typeTheme } = useThemeContext();
	const [exchanges, setExchanges] = useState<Exchange[]>([]);
	const [filter, setFilter] = useState<Filter>({
		offset: 0,
		limit: pageSize,
	});
	const [filterVisible, setFilterVisible] = useState<boolean>(false);
	const [loadingExchange, setLoadingExchange] = useState<boolean>(false);
	const [editing, setEditing] = useState<boolean>(false);
	const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
	const [form] = Form.useForm();
	const refreshBalanceTimeouts = useRef<NodeJS.Timeout[]>([]);
	const exchange = Form.useWatch<string>('exchange', form);
	const nameInputRef = useRef<InputRef>(null);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [exchangesTotal, setExchangesTotal] = useState<number>(0);
	const prevExchangeIdList = useRef<number[]>([]);

	const themeConfigParent = {
		components: {
			Dropdown: {
				borderRadiusLG: 12,
				borderRadiusSM: 12,
				boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowSecondary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowTertiary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				colorBgMask: themeObject[typeTheme].colorBgDropdown,
				colorBgElevated: themeObject[typeTheme].colorBgDropdown,
			},
		},
	};

	const themeConfig = {
		components: {
			Input: {
				controlHeight: 60,
				fontSize: 16,
				colorIcon: themeObject[typeTheme].colorIconEyeInput,
				colorIconHover: themeObject[typeTheme].colorIconEyeInput,
			},
			Select: {
				fontSize: 16,
				controlHeight: 60,
			},
		},
	};

	const convertSupportExchange = useMemo<SupportExchange[]>(() => {
		return Object.values(
			mockSupportMyExchangeData.reduce<Record<string, SupportExchange>>(
				(result, exchange) => ({
					...result,
					[exchange.code]:
						!result[exchange.code] || result[exchange.code].mode === MARKET_MODE.future
							? exchange
							: result[exchange.code],
				}),
				{}
			)
		);
	}, []);

	const loadMyExchange = () => {
		setLoadingExchange(true);
		setExchanges(mockExchanges);
		setExchangesTotal(mockExchanges.length);
		setLoadingExchange(false);
	};

	const handleSearchMobile = () => {
		setFilterVisible(false);
		const selectedId = query.get('selected');
		if (selectedId) {
			const exchange = mockExchanges.find((exchange) => `${exchange.id}` === selectedId);
			if (exchange && !selectedExchange) {
				setSelectedExchange(exchange);
				form.setFieldsValue(exchange);
				setEditing(true);
				nameInputRef.current?.focus();
				window.scroll({ top: 300, behavior: 'smooth' });
			} else if (!selectedExchange) {
				navigate('/exchanges');
			}
		}
	};

	const refreshBalance = (exchangeIdList: number[], exchanges: Exchange[]) => {
		console.log(exchangeIdList);
		console.log(exchanges);
	};

	const handleCreateExchange = (values: {
		name: string,
		exchange: string,
		api_key: string,
		api_secret: string,
		api_password?: string,
	}) => {
		console.log(values);
	};

	const handleUpdateExchange = (
		exchangeId: number,
		values: { name: string, api_key: string, api_secret: string, api_password?: string }
	) => {
		console.log(values);
	};

	const handleDeleteExchange = (exchangeId: number) => {
		console.log(exchangeId);
	};

	const onChangeFilter = (updateFilter: Partial<Filter>) => setFilter({ ...filter, ...updateFilter });

	useEffect(() => {
		const errorFields = form.getFieldsError().reduce<string[]>((arr, field) => {
			if (field.errors.length) {
				arr.push(field.name[0] as string);
			}
			return arr;
		}, []);
		form.validateFields(errorFields);
	}, [form, stateStore.language]);

	const getFilterView = () => (
		<div className="md:flex gap-2 space-y-2 md:space-y-0">
			<Input
				className="w-full xl:min-w-[240px]"
				placeholder={t('Search by name')}
				suffix={<SearchOutlined />}
				onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
					if (e.target.value !== filter.name) {
						setFilter({ ...filter, name: e.target.value });
					}
				}}
				onPressEnter={(e: React.KeyboardEvent<HTMLInputElement>) => {
					setFilter({ ...filter, name: e.currentTarget.value });
				}}
				data-qa="bot-filter-name-input"
			/>
			<Select
				className="w-full xl:min-w-[240px]"
				placeholder={t('exchange')}
				allowClear={{ clearIcon: <CloseCircleFilled className="text-[red] text-[14px]" /> }}
				onChange={(exchange: string) => setFilter({ ...filter, exchange_code: exchange })}
				onClear={() => setFilter({ ...filter, exchange_code: undefined })}
				data-qa="exchange-select"
				popupClassName="exchange-select"
				showSearch
				disabled={loadingExchange}
			>
				{convertSupportExchange.map(({ code, name }) => (
					<Option key={code} value={code}>
						<div className="flex items-center h-full">
							<img className="w-[20px] mr-2" src={handleGetExchangeLogo(code)} alt={name} />
							<p className="m-0">{name}</p>
						</div>
					</Option>
				))}
			</Select>
			<Select
				className="w-full xl:min-w-[240px]"
				placeholder={t('trading_type')}
				onChange={(type: string) => setFilter({ ...filter, mode: type })}
				onClear={() => setFilter({ ...filter, mode: MARKET_MODE.all })}
				data-qa="trading-type-select"
				popupClassName="trading-type-select"
				options={MARKET_MODE_OPTS}
				defaultValue={MARKET_MODE.all}
			/>
			<Button className="lg:!hidden button-primary w-full" type="primary" onClick={handleSearchMobile}>
				{t('apply')}
			</Button>
		</div>
	);

	useEffect(() => {
		loadMyExchange();
		prevExchangeIdList.current = mockExchanges.map((i) => i.id);
		const selectedId = query.get('selected');
		if (selectedId) {
			const exchange = mockExchanges.find((exchange) => `${exchange.id}` === selectedId);
			if (exchange && !selectedExchange) {
				setSelectedExchange(exchange);
				form.setFieldsValue(exchange);
				setEditing(true);
				nameInputRef.current?.focus();
				window.scroll({ top: 300, behavior: 'smooth' });
			} else if (!selectedExchange) {
				navigate('/exchanges');
			}
		}
	}, [filter]);

	useEffect(() => {
		if (prevExchangeIdList.current?.length < exchanges?.length) {
			const exchangeIdList = exchanges.map((i) => i.id);
			const differentElements = exchangeIdList
				.filter((element) => !prevExchangeIdList.current.includes(element))
				.concat(prevExchangeIdList.current.filter((element) => !exchangeIdList.includes(element)));
			const timeout = setTimeout(() => refreshBalance(differentElements, exchanges), 2000);
			refreshBalanceTimeouts.current.push(timeout);
			prevExchangeIdList.current = exchangeIdList;
		}
		return () => {
			refreshBalanceTimeouts.current.forEach(clearTimeout);
		};
	}, [exchanges]);

	return (
		<ConfigProvider theme={themeConfigParent}>
			<div className="px-4 md:px-8 my_exchange">
				<div className="flex justify-between items-center gap-2">
					<div className="hidden lg:block mb-4">{getFilterView()}</div>
					<div className="mb-4 flex-1 flex md:justify-end justify-start">
						<Button
							className={`flex items-center w-full md:w-auto border-none`}
							type="primary"
							onClick={() => {
								setEditing(false);
								form.resetFields();
								navigate('/exchanges');
								nameInputRef.current?.focus();
								document.getElementById('exchange-name-input')?.scrollIntoView({
									behavior: 'smooth',
									block: 'center',
									inline: 'center',
								});
							}}
							icon={<PlusOutlined />}
						>
							{t('Connect New Account')}
						</Button>
					</div>
					<div className="lg:hidden mb-4">
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
								className="button-primary-outline--default"
								icon={<FilterICon color={'#8188A9'} />}
							/>
						</Popover>
					</div>
				</div>
				<div className="cards-slider owl-carousel mt-2">
					{loadingExchange ? (
						<div className="h-[200px] flex items-center justify-center">
							<Loading />
						</div>
					) : (
						<MyWalletsSlider
							onChangeFilter={onChangeFilter}
							filter={filter}
							exchangesTotal={exchangesTotal}
							exchanges={exchanges}
							onEdit={(exchangeId: number) => {
								setEditing(true);
								const exchange = exchanges.find(({ id }) => id === exchangeId);
								setSelectedExchange(exchange || null);
								form.setFieldsValue(exchange);
								nameInputRef.current?.focus();
								window.scroll({ top: 300, behavior: 'smooth' });
							}}
							onDelete={handleDeleteExchange}
							isDemoAccount={true}
						/>
					)}
				</div>

				<div id="form" className="mt-8">
					<div className="card-primary">
						<p className="font-semibold my-4 text-primary text-[16px]">
							{editing ? t('edit_my_exchange') : t('add_new_exchange')}
						</p>

						<ConfigProvider theme={themeConfig}>
							<Form
								form={form}
								initialValues={{ exchange: mockSupportMyExchangeData[0].code }}
								onFinish={(values: {
									name: string,
									exchange: string,
									api_key: string,
									api_secret: string,
									api_password?: string,
								}) => {
									setErrors({});
									if (editing && selectedExchange) {
										handleUpdateExchange(selectedExchange.id, values);
									} else {
										handleCreateExchange(values);
									}
								}}
								disabled={false}
								onValuesChange={() => setErrors({})}
							>
								<div>
									<p className="m-0 mb-2 text-secondary text-[16px]">{t('name')}</p>
									<Form.Item
										name="name"
										rules={[{ required: true, message: t('name_must_not_be_empty') }]}
									>
										<Input
											ref={nameInputRef}
											placeholder={t('your_exchange_name')}
											data-qa="exchange-name-input"
											id="exchange-name-input"
										/>
									</Form.Item>
								</div>
								<div className="my-4">
									<p className="m-0 mb-2 text-secondary text-[16px]">{`${t('exchange')}:`}</p>
									<Form.Item name="exchange">
										<Select
											className="w-full"
											data-qa="exchange-select"
											popupClassName="exchange-select"
											disabled={editing}
											showSearch
											optionFilterProp="label"
										>
											{convertSupportExchange.map(({ code, name }) => (
												<Option key={code} value={code} label={name}>
													<div className="flex items-center h-full">
														<img
															className="w-[20px] mr-2"
															src={handleGetExchangeLogo(code)}
															alt={name}
														/>
														<p className="m-0">{name}</p>
													</div>
												</Option>
											))}
										</Select>
									</Form.Item>
								</div>
								<div
									className={`grid grid-cols-1 ${
										exchange === 'kucoin' || exchange === 'okx' ? '' : 'lg:grid-cols-2'
									} gap-x-4`}
								>
									<div>
										<p className="m-0 mb-2 text-secondary text-[16px]">{t('api_key')}</p>
										<Form.Item
											name="api_key"
											rules={[{ required: true, message: t('api_key_warning') }]}
											validateStatus={errors.api_key ? 'error' : undefined}
											help={errors.api_key}
										>
											<Input
												placeholder={t('exchange_api_key')}
												autoComplete="off"
												data-qa="exchange-api-key-input"
											/>
										</Form.Item>
									</div>

									<div
										className={`grid grid-cols-1 ${
											exchange === 'kucoin' || exchange === 'okx' ? 'lg:grid-cols-2' : ''
										} gap-x-4`}
									>
										<div>
											<p className="m-0 mb-2 text-secondary text-[16px]">{t('api_secret')}</p>
											<Form.Item
												name="api_secret"
												rules={[{ required: true, message: t('api_secret_warning') }]}
												validateStatus={errors.api_secret ? 'error' : undefined}
												help={errors.api_secret}
											>
												<Input.Password
													placeholder={t('exchange_api_secret')}
													autoComplete="new-password"
													data-qa="exchange-secret-key-input"
												/>
											</Form.Item>
										</div>
										{(exchange === 'kucoin' || exchange === 'okx') && (
											<div>
												<p className="m-0 mb-2 text-secondary text-[16px]">
													{t('api_password')}
												</p>
												<Form.Item
													name="api_password"
													rules={[
														{
															required: exchange === 'kucoin' || exchange === 'okx',
															message: t('api_password_warning'),
														},
													]}
													validateStatus={errors.api_password ? 'error' : undefined}
													help={errors.api_password}
												>
													<Input.Password
														placeholder={t('exchange_api_password')}
														autoComplete="new-password"
														data-qa="exchange-secret-password-input"
													/>
												</Form.Item>
											</div>
										)}
									</div>
								</div>

								<div className="flex justify-end mt-4 gap-2">
									{editing && (
										<CancelButton
											onClick={() => {
												setEditing(false);
												form.setFieldsValue({
													name: '',
													exchange: 'binance',
													api_key: '',
													api_secret: '',
												});
											}}
											data-qa="exchange-cancel-button"
										/>
									)}
									<Button
										type="primary"
										htmlType="submit"
										data-qa="exchange-create-button"
										className={`border-none w-[94px]`}
										disabled={false}
									>
										{editing ? t('update') : t('create')}
									</Button>
								</div>
								<ImportNote />
							</Form>
						</ConfigProvider>

						<SupportExchanges supportExchanges={convertSupportExchange} />
					</div>
				</div>
			</div>
		</ConfigProvider>
	);
};

export default memo(MyWallets);
