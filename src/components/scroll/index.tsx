import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to the top of the page
	}, [pathname]); // Trigger whenever the route changes

	return null; // No UI needed
};

export default ScrollToTop;
