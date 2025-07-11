import { defineRollupConfig } from '@calendash/config';

/** @type import('rollup').RollupOptions */
export default defineRollupConfig({
	inputs: [
		{
			path: './src/index.ts',
			name: 'core',
			entry: 'CalendashCore',
		},
		{
			path: './src/helpers/index.ts',
			name: 'core.helpers',
			entry: 'CalendashCoreHelpers',
		},
		{
			path: './src/utils/index.ts',
			name: 'core.utils',
			entry: 'CalendashCoreUtils',
		},
		{
			path: './src/middlewares/index.ts',
			name: 'core.middlewares',
			entry: 'CalendashCoreMdws',
		},
	],
	outputs: {
		cjs: false,
	},
});
