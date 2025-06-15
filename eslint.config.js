import baseConfig from '@aduth/eslint-config';
import globals from 'globals';

export default [
	{
		ignores: [
			'**/node_modules/**',
			'**/build/**',
			'**/dist/**',
			'**/sprintf-*.js',
		],
	},
	...baseConfig,
	{
		files: ['packages/**/*.js', 'eslint.config.js', 'rollup.config.js'],
		languageOptions: {
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
				ecmaFeatures: {
					modules: true,
				},
			},
		},
		rules: {
			camelcase: 'off',
			'no-var': 'off',
			'prefer-spread': 'off',
		},
	},
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.mocha,
			},
		},
	},
	{
		files: ['**/__tests__/**/*.{js,ts,tsx}', '**/benchmark/*.{js,ts,tsx}'],
		rules: {
			'no-console': 'off',
			camelcase: 'off',
		},
	},
];
