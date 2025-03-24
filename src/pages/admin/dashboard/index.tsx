import React from 'react';

import HomeBanner from './components/HomeBanner';
import MyPortfolioView from '@pages/admin/dashboard/components/MyPortfolioView';
import { mockExchanges } from '@mockdata/exchanges';
import TickerPriceWidget from '@pages/admin/dashboard/components/TickerPriceWidget';
import FearAndGreedView from '@pages/admin/dashboard/components/FearAndGreedView';
import BotPerformanceView from '@pages/admin/dashboard/components/BotPerformanceView';
import { mockBotsData } from '@mockdata/bots';
import CoinBoughtOverview from '@pages/admin/dashboard/components/CoinBoughtOverview';

const Home = () => {
	return (
		<div className="grid grid-cols-4 gap-5 px-4 md:px-8">
			<div className="col-span-4 md:col-span-3">
				<div className="hidden md:block">
					<HomeBanner />
				</div>
				<div className="hidden md:block mb-6">
					<TickerPriceWidget />
				</div>
				<div className="card-primary">
					<BotPerformanceView className="h-full min-h-[300px]" bots={mockBotsData} period="daily" />
				</div>

				<div className="card-primary mt-[20px] lg:hidden block">
					<FearAndGreedView />
				</div>
				<div className="card-primary mt-[20px]">
					<CoinBoughtOverview bots={mockBotsData || []} />
				</div>
			</div>
			<div className="order-first col-span-4 lg:col-span-1 md:order-last">
				<MyPortfolioView exchanges={mockExchanges} />
			</div>
		</div>
	);
};

export default Home;
