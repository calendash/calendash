import { defineRollupConfig } from '@calendash/config';

/** @type import('rollup').RollupOptions */
export default defineRollupConfig({
	inputs: [
		{
			path: './src/index.ts',
			name: 'core',
			entry: 'CalendashCore',
		},
	],
	outputs: {
		cjs: false,
	},
});
