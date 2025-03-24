import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
	{ ignores: ['dist'] },
	{
		extends: [
			pluginJs.configs.recommended,
			...tseslint.configs.recommended,
			pluginReact.configs.flat.recommended,
			eslintConfigPrettier,
			eslintPluginPrettierRecommended,
		],
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		rules: {
			'prettier/prettier': [
				'error',
				{
					trailingComma: 'es5',
					parser: 'flow',
					singleQuote: true,
					printWidth: 120,
					tabWidth: 4,
					useTabs: true,
					bracketSpacing: true,
					'--bracket-same-line': false,
					endOfLine: 'auto',
				},
			],
			'arrow-body-style': 'off',
			'prefer-arrow-callback': 'off',
			'react/no-is-mounted': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'react-refresh/only-export-components': 'off',
			...reactHooks.configs.recommended.rules,
		},
	}
);
