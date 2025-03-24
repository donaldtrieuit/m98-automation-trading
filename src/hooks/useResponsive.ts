import { useMediaQuery } from 'react-responsive';
import { breakpoints } from '@utils';

export const useResponsive = () => {
	const isSmallScreen = useMediaQuery({ maxWidth: breakpoints.sm });
	const isMediumScreen = useMediaQuery({ maxWidth: breakpoints.md });
	const isLargeScreen = useMediaQuery({ maxWidth: breakpoints.lg });
	const isExtraLargeScreen = useMediaQuery({ minWidth: breakpoints.xl });
	const is2XLargeScreen = useMediaQuery({ minWidth: breakpoints['2xl'] });
	const is3XLargeScreen = useMediaQuery({ minWidth: breakpoints['3xl'] });

	return {
		isSmallScreen,
		isMediumScreen,
		isLargeScreen,
		isExtraLargeScreen,
		is2XLargeScreen,
		is3XLargeScreen,
	};
};
