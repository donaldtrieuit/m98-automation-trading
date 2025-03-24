/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	safelist: [{ pattern: /col-span-/, variants: ['sm', 'lg'] }, 'w-7', 'h-7'],
	theme: {
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px',
			'3xl': '2000px',
		},
		colors: () => ({
			inherit: 'inherit',
			current: 'currentColor',
			transparent: 'transparent',
			'green-01': '#11CABE',
			'green-02': '#30E0A1',
			'red-01': '#FA2256',
			black: '#000',
			white: '#fff',
			slate: {
				50: '#f8fafc',
				100: '#f1f5f9',
				200: '#E5E8ED', //edit
				300: '#cbd5e1',
				400: '#4C608A1A', //edit
				500: '#64748b',
				600: '#475569',
				700: '#334155',
				800: '#afb3be40', // edit
				900: '#0f172a',
			},
			gray: {
				50: '#f9fafb',
				100: '#F2F2F2', //edit
				200: '#f7f7f7', //edit
				300: '#DFDFDF', //edit
				400: '#D5D5D7', //edit border btn
				500: '#b3b3b3', //edit color lable
				600: '#8D899C', //edit
				700: '#5F646C', //edit
				800: '#C8C6CE', //edit
				900: '#252729',
			},
			zinc: {
				50: '#fafafa',
				100: '#f4f4f5',
				200: '#e4e4e7',
				300: '#d4d4d8',
				400: '#a1a1aa',
				500: '#F0F0F0', //edit
				600: '#52525b',
				700: '#4A4B56', //edit
				800: '#27272a',
				900: '#18181b',
			},
			neutral: {
				50: '#fafafa',
				100: '#DADADA', //edit
				200: '#e5e5e5',
				300: '#9FA3AC', //edit
				400: '#C6C6C8',
				500: '#393839', //edit
				600: '#9D9BA4', //edit
				700: '#404040',
				800: '#898A8D', //edit
				900: '#353B49', //edit
			},
			stone: {
				50: '#e1e1e1', //edit
				100: '#f5f5f4',
				200: '#e7e5e4',
				300: '#D9D9D9',
				400: '#a8a29e',
				500: '#A3A7AE', // border input dark
				600: '#57534e',
				700: '#DCE0E4', //edit
				800: '#292524',
				900: '#1c1917',
			},
			red: {
				50: '#fef2f2',
				100: '#fee2e2',
				200: '#F5F1F3', //edit
				300: '#DA104D', //edit
				400: '#f87171',
				500: '#ef4444',
				600: '#dc2626',
				700: '#DA104D1A', //edit
				800: '#991b1b',
				900: '#7f1d1d',
			},
			orange: {
				50: '#fff7ed',
				100: '#ffedd5',
				200: '#fed7aa',
				300: '#fdba74',
				400: '#fb923c',
				500: '#f97316',
				600: '#ea580c',
				700: '#c2410c',
				800: '#9a3412',
				900: '#7c2d12',
			},
			amber: {
				50: '#fffbeb',
				100: '#fef3c7',
				200: '#fde68a',
				300: '#fcd34d',
				400: '#fbbf24',
				500: '#f59e0b',
				600: '#d97706',
				700: '#b45309',
				800: '#92400e',
				900: '#78350f',
			},
			yellow: {
				50: '#fefce8',
				100: '#fef9c3',
				200: '#F8EBC8', //edit
				300: '#DCAC00', //edit
				400: '#facc15',
				500: '#eab308',
				600: '#DFAA11',
				700: '#DFAA1133', //edit
				800: '#854d0e',
				900: '#713f12',
			},
			lime: {
				50: '#f7fee7',
				100: '#ecfccb',
				200: '#d9f99d',
				300: '#bef264',
				400: '#a3e635',
				500: '#84cc16',
				600: '#65a30d',
				700: '#4d7c0f',
				800: '#3f6212',
				900: '#365314',
			},
			green: {
				50: '#f0fdf4',
				100: '#dcfce7',
				200: '#bbf7d0',
				300: '#DBFAE5FC', //edit
				400: '#4ade80',
				500: '#1AA553',
				600: '#16a34a',
				700: '#DBFAE5F2', //edit
				800: '#166534',
				900: '#14532d',
			},
			emerald: {
				50: '#ecfdf5',
				100: '#d1fae5',
				200: '#a7f3d0',
				300: '#6ee7b7',
				400: '#34d399',
				500: '#10b981',
				600: '#059669',
				700: '#047857',
				800: '#065f46',
				900: '#064e3b',
			},
			teal: {
				50: '#f0fdfa',
				100: '#ccfbf1',
				200: '#99f6e4',
				300: '#5eead4',
				400: '#2dd4bf',
				500: '#14b8a6',
				600: '#0d9488',
				700: '#0f766e',
				800: '#115e59',
				900: '#134e4a',
			},
			cyan: {
				50: '#ecfeff',
				100: '#cffafe',
				200: '#a5f3fc',
				300: '#67e8f9',
				400: '#22d3ee',
				500: '#06b6d4',
				600: '#0891b2',
				700: '#0e7490',
				800: '#155e75',
				900: '#164e63',
			},
			sky: {
				50: '#f0f9ff',
				100: '#e0f2fe',
				200: '#bae6fd',
				300: '#7dd3fc',
				400: '#38bdf8',
				500: '#0ea5e9',
				600: '#0284c7',
				700: '#0369a1',
				800: '#075985',
				900: '#0c4a6e',
			},
			blue: {
				50: '#eff6ff',
				100: '#dbeafe',
				200: '#bfdbfe',
				300: '#93c5fd',
				400: '#60a5fa',
				500: '#3b82f6',
				600: '#2563eb',
				700: '#1d4ed8',
				800: '#1e40af',
				900: '#1e3a8a',
			},
			indigo: {
				50: '#eef2ff',
				100: '#EAE6FC',
				200: '#c7d2fe',
				300: '#F9FBFE', //edit
				400: '#EDE9FA', //edit background btn
				500: '#6366f1',
				600: '#4f46e5',
				700: '#4338ca',
				800: '#3730a3',
				900: '#542BE2', //edit
			},
			violet: {
				50: '#542BE21C', //edit
				100: '#542BE233 ', //edit
				200: '#DFD9FD', //edit
				300: '#AA95F0', //edit
				400: '#a78bfa',
				500: '#8b5cf6',
				600: '#7c3aed',
				700: '#6d28d9',
				800: '#5b21b6',
				900: '#4c1d95',
			},
			purple: {
				50: '#faf5ff',
				100: '#f3e8ff',
				200: '#e9d5ff',
				300: '#d8b4fe',
				400: '#c084fc',
				500: '#a855f7',
				600: '#9333ea',
				700: '#6E2FC5',
				800: '#6b21a8',
				900: '#581c87',
			},
			fuchsia: {
				50: '#fdf4ff',
				100: '#fae8ff',
				200: '#f5d0fe',
				300: '#f0abfc',
				400: '#e879f9',
				500: '#d946ef',
				600: '#c026d3',
				700: '#a21caf',
				800: '#86198f',
				900: '#701a75',
			},
			pink: {
				50: '#fdf2f8',
				100: '#fce7f3',
				200: '#fbcfe8',
				300: '#f9a8d4',
				400: '#f472b6',
				500: '#ec4899',
				600: '#db2777',
				700: '#be185d',
				800: '#9d174d',
				900: '#831843',
			},
			rose: {
				50: '#fff1f2',
				100: '#ffe4e6',
				200: '#fecdd3',
				300: '#fda4af',
				400: '#fb7185',
				500: '#f43f5e',
				600: '#DA104D',
				700: '#be123c',
				800: '#9f1239',
				900: '#881337',
			},
		}),
		extend: {
			fontFamily: {
				bebas: ['Bebas Neue', 'sans-serif'],
				jakarta: ['Plus Jakarta Sans', 'sans-serif'],
				sourcesans: ['SourceSansPro', 'sans-serif'],
				sans: ['Roboto', 'ui-sans-serif', 'system-ui'],
				helveticaNeue: ['Helvetica Neue', 'sans-serif'],
				BebasNeue: ['Bebas Neue', 'sans-serif'],
			},
			keyframes: {
				shine: {
					'100%': { left: '125%' },
				},
				burgerHover: {
					'0%': { width: '100%' },
					'50%': { width: '50%' },
					'100%': { width: '100%' },
				},
				introXAnimation: {
					to: {
						opacity: '1',
						transform: 'translateX(0px)',
					},
				},
			},
			boxShadow: {
				'card-shadow': '0px 4px 28.2px 0px rgba(84, 43, 226, 0.05)',
				'card-club-proposal': '0px 4px 19.5px 0px rgba(0, 0, 0, 0.10)',
				'chart-shadow': '0px 2px 14.5px 0px rgba(0, 0, 0, 0.09)',
				'box-time': '0px 3px 6px 0px rgba(128, 77, 18, 0.11)',
			},
			animation: {
				shine: 'shine 0.8s',
				'intro-x-animation': 'introXAnimation .4s ease-in-out forwards .33333s',
				'burger-hover-2': 'burgerHover 1s infinite ease-in-out alternate forwards 200ms',
				'burger-hover-4': 'burgerHover 1s infinite ease-in-out alternate forwards 400ms',
				'burger-hover-6': 'burgerHover 1s infinite ease-in-out alternate forwards 600ms',
			},
		},
	},
	plugins: [],
};
