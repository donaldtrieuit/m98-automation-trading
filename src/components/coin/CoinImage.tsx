import React, { useState, useEffect } from 'react';

// Default color array
const defaultColors: string[] = ['#A62A21', '#7e3794', '#0B51C1', '#3A6024', '#A81563', '#B3003C'];

// PRNG function with typed parameters and return value
const _stringAsciiPRNG = (value: string, m: number): number => {
	const charCodes = [...value].map((letter) => letter.charCodeAt(0));
	const len = charCodes.length;

	const a = (len % (m - 1)) + 1;
	const c = charCodes.reduce((current, next) => current + next) % m;

	let random = charCodes[0] % m;
	for (let i = 0; i < len; i += 1) random = (a * random + c) % m;

	return random;
};

// Function to get a random color based on a value
const getRandomColor = (value: string, colors: string[] = defaultColors): string => {
	if (!value) return 'transparent';

	const colorIndex = _stringAsciiPRNG(value, colors.length);
	return colors[colorIndex];
};

// Props interface for CoinIcon component
interface CoinIconProps {
	className?: string;
	symbol: string;
	size: number | string; // Allowing string for CSS units like "42px"
	showAlt?: boolean;
}

// CoinIcon component with typed props
const CoinIcon: React.FC<CoinIconProps> = ({ className = '', symbol, size, showAlt = true }) => {
	const [error, setError] = useState<boolean>(false);
	const [formatSymbol, setFormatSymbol] = useState<string>(symbol);

	useEffect(() => {
		const { length } = symbol;
		let tmpSymbol = symbol.toLowerCase();
		if (tmpSymbol.includes('down', length - 4) && length > 4) {
			tmpSymbol = tmpSymbol.replace('down', '');
		} else if (tmpSymbol.includes('up', length - 2) && length > 3) {
			tmpSymbol = tmpSymbol.replace('up', '');
		}
		setFormatSymbol(tmpSymbol);
		setError(false);
	}, [symbol]);

	if (!error) {
		return (
			<img
				className={`${className} inline-block ${error ? 'invisible' : ''}`}
				src={`/media/icons/${formatSymbol}.png`}
				alt={showAlt ? symbol : ''}
				style={{ width: size }}
				onError={() => {
					setError(true);
				}}
			/>
		);
	}

	const bg = getRandomColor(symbol);
	return (
		<div
			className={`${className} rounded-full inline-flex justify-center items-center`}
			style={{ width: size, height: size, background: bg }}
		>
			<span className="text-white">{symbol[0]}</span>
		</div>
	);
};

export default CoinIcon;
