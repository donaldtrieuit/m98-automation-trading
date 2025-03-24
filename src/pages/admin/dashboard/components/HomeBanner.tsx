import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import { Carousel } from 'antd';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import homeBannerImage1 from '@assets/images/banner/img-1.png';
import homeBannerImage2 from '@assets/images/banner/img-2.png';
import homeBannerImage3 from '@assets/images/banner/img-3.png';
import { CarouselRef } from 'antd/es/carousel';

// Define interfaces
interface BannerItem {
	id: string;
	label: string;
	value: string;
	href: string;
	content?: React.FC;
}

// Convert to TypeScript component
const HomeBanner: React.FC = () => {
	const carouselRef = useRef<CarouselRef>(null);

	const handlePrevious = (): void => {
		carouselRef.current?.prev();
	};

	const handleNext = (): void => {
		carouselRef.current?.next();
	};

	const DEFAULT_CRYPTO_SLIDER: BannerItem[] = [
		{ label: '1', value: homeBannerImage1, id: '1', href: '' },
		{ label: '2', value: homeBannerImage2, id: '2', href: '' },
		{ label: '3', value: homeBannerImage3, id: '3', href: '' },
	];

	return (
		<div className="relative">
			<Carousel dots={false} autoplay ref={carouselRef} className="w-full" fade>
				{(DEFAULT_CRYPTO_SLIDER || []).map((item: BannerItem) => {
					const Content = item?.content;
					return (
						<div className="flex items-center slider w-full relative" key={item.id}>
							<img
								src={item.value}
								alt="img"
								className="rounded-xl cursor-pointer w-full"
								onClick={() => {
									if (item.href) {
										window.open(item.href, '_blank');
									}
								}}
							/>
							{Content && <Content />}
						</div>
					);
				})}
			</Carousel>
			<div className="absolute bottom-4 right-4 inline-flex gap-2 z-3">
				<button
					onClick={handlePrevious}
					className="h-6 w-6 hover:scale-110 text-white disabled:text-gray-600 text-[24px]"
				>
					<LeftCircleOutlined />
				</button>
				<button
					onClick={handleNext}
					className="h-6 w-6 hover:scale-110 text-white disabled:text-gray-600 text-[24px]"
				>
					<RightCircleOutlined />
				</button>
			</div>
		</div>
	);
};

export default observer(HomeBanner);
