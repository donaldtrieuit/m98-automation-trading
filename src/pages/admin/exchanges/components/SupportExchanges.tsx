import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { handleGetExchangeLargeLogo } from '@utils';

// Interface for SupportExchange
interface SupportExchange {
	code: string;
	mode: string;
	name: string;
	referLink?: string;
}

// Interface for props
interface SupportExchangesProps {
	supportExchanges?: SupportExchange[];
}

const SupportExchanges: React.FC<SupportExchangesProps> = ({ supportExchanges = [] }) => {
	const { t } = useTranslation();

	return (
		<>
			<p className="font-medium mt-4 text-primary">{t('dont_have_exchange_account')}</p>
			<p className="mb-4 text-secondary text-[14px]">{t('create_exchange_account_guide')}</p>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-y-8">
				{supportExchanges.map(({ code, mode, name, referLink }) =>
					mode !== 'future' ? (
						<a href={referLink} target="_blank" rel="noreferrer" className="w-full" key={code}>
							<div className="item_exchange w-full">
								<img className="w-full" src={handleGetExchangeLargeLogo(code)} alt={name} />
							</div>
						</a>
					) : null
				)}
			</div>
		</>
	);
};

export default memo(SupportExchanges);
