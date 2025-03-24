import React, { useEffect, useState } from 'react';
import { List, Skeleton, Badge } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';
import { Converter } from 'showdown';

import { useStore } from '@providers/AppProvider';
import Loading from '@components/loading';
import NotificationDetailModal from './NotificationDetailModal';
import { BotIcon } from '@assets/icons/BotIcon';
import { Notification } from '@types';
import { mockNotifications } from '@mockdata/notifications'; // Adjust path

// Initialize markdown converter
const markdownConverter = new Converter({ moreStyling: true, literalMidWordUnderscores: true });

const NotificationContent: React.FC<WithTranslation> = ({ t }) => {
	const { authStore } = useStore();
	const [page, setPage] = useState<number>(1);
	const [total, setTotal] = useState<number>(0);
	const [data, setData] = useState<Notification[]>([]);
	const [selectedItem, setSelectedItem] = useState<Notification | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const loadData = (page: number, isChangeLanguage = false) => {
		setTotal(100);
		if (isChangeLanguage) {
			setData([...mockNotifications]);
		} else {
			setData((prevData) => [...prevData, ...mockNotifications]);
		}
		const unreadCount = mockNotifications.reduce((result: number, { unread }: Notification) => {
			return unread ? result + 1 : result;
		}, 0);
		console.log(mockNotifications);
		authStore.setUnreadNotifyCount(Math.max(authStore.unreadNotifyCount, unreadCount));
		setLoading(false);
	};

	const loadMoreData = () => {
		setPage((prevPage) => prevPage + 1);
		return loadData(page + 1);
	};

	useEffect(() => {
		loadData(page);
	}, []);

	return (
		<div className="notification w-[330px] lg:w-[356px] h-[600px] relative">
			<div className="flex justify-between">
				<div className="inline-flex items-center gap-1">
					<p className="text-primary text-[12px]">{t('Your notifications')}</p>
					<Badge
						style={{ color: 'white' }}
						className="text-white"
						showZero={false}
						color={authStore.unreadNotifyCount > 0 ? '#FA2256' : ''}
						count={authStore.unreadNotifyCount}
					/>
				</div>
				<a
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						authStore.markAllNotifyAsRead();
					}}
					className="link-primary pr-2 text-[12px] text-[#2180f8]"
					href="#"
				>
					{t('mark_all_as_read')}
				</a>
			</div>
			<div
				id="scrollableDiv"
				className="mt-[10px] h-[500px]"
				style={{
					overflow: 'auto',
				}}
			>
				{loading ? (
					<div className="flex items-center justify-center h-full w-full">
						<Loading />
					</div>
				) : (
					<InfiniteScroll
						dataLength={data.length}
						next={loadMoreData}
						hasMore={data.length < total}
						loader={
							<Skeleton
								avatar
								paragraph={{
									rows: 1,
								}}
								active
							/>
						}
						scrollableTarget="scrollableDiv"
					>
						<List
							dataSource={data}
							renderItem={(item: Notification, index: number) => (
								<List.Item
									key={index}
									onClick={() => {
										if (item.unread) {
											setData((prevData) =>
												prevData.map((notify) =>
													notify.id === item.id ? { ...notify, unread: false } : notify
												)
											);
										}
										setSelectedItem(item);
									}}
								>
									<List.Item.Meta
										avatar={
											<div className="card-item-avatar">
												<BotIcon width={24} height={24} />
											</div>
										}
										title={
											<Badge
												color="#FA2256"
												dot={item.unread}
												className="w-full"
												status="error"
												offset={[0, 10]}
											>
												<p className="mb-0 text-primary text-[14px] font-medium truncate w-full">
													{item.verb}
												</p>
											</Badge>
										}
										description={
											<div className="text-secondary text-[12px]">
												<div
													className="mb-2 text-primary line-clamp"
													dangerouslySetInnerHTML={{
														__html: markdownConverter.makeHtml(item.description),
													}}
												/>
												<span>
													{dayjs
														.tz(parseInt(item.timestamp) * 1000)
														.format('DD-MM-YYYY HH:mm:ss')}
												</span>
											</div>
										}
									/>
								</List.Item>
							)}
						/>
					</InfiniteScroll>
				)}
			</div>
			<div className="absolute bottom-0 w-full pr-2">
				<button className="btn-read-more cursor-pointer link-primary text-[12px]">
					{t('notification_unread_description', { count: authStore.unreadNotifyCount })}
				</button>
			</div>
			{selectedItem && (
				<NotificationDetailModal
					open={!!selectedItem}
					notification={selectedItem}
					onClose={() => setSelectedItem(null)}
				/>
			)}
		</div>
	);
};

export default withTranslation()(NotificationContent);
