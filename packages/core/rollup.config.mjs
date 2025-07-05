import { defineRollupConfig } from '@calendash/shared';

/** @type import('rollup') */
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
