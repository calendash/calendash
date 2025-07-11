import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import type { Plugin, RollupOptions } from 'rollup';
import type { FormatType, InputOption, NormalizedOutputs } from './types.mjs';

export default (
	input: InputOption,
	outputs: NormalizedOutputs,
	plugins: readonly Plugin[]
): Record<FormatType, readonly RollupOptions[] | RollupOptions> => ({
	esm: {
		input: input.path,
		output: {
			file: `./dist/calendash.${input.name}.esm.js`,
			format: 'esm',
		},
		external: outputs.esm.external,
		plugins: [
			replace({
				__DEV__: 'process.env.NODE_ENV !== "production"',
				preventAssignment: true,
			}),
			...plugins,
		],
	},
	mjs: {
		input: input.path,
		output: {
			file: `./dist/calendash.${input.name}.mjs`,
			format: 'esm',
		},
		external: outputs.mjs.external,
		plugins: [
			replace({
				__DEV__: 'process.env.NODE_ENV !== "production"',
				preventAssignment: true,
			}),
			...plugins,
		],
	},
	cjs: {
		input: input.path,
		output: {
			name: input.entry,
			file: `./dist/calendash.${input.name}.cjs`,
			globals: outputs.cjs.globals,
			format: 'cjs',
		},
		external: outputs.cjs.external,
		plugins: [
			replace({
				__DEV__: 'process.env.NODE_ENV !== "production"',
				preventAssignment: true,
			}),
			...plugins,
		],
	},
	umd: [
		{
			input: input.path,
			output: {
				name: input.entry,
				file: `./dist/calendash.${input.name}.umd.js`,
				format: 'umd',
				globals: outputs.umd.globals,
			},
			external: outputs.umd.external,
			plugins: [
				replace({
					__DEV__: 'true',
					preventAssignment: true,
				}),
				...plugins,
			],
		},
		{
			input: input.path,
			output: {
				name: input.entry,
				file: `./dist/calendash.${input.name}.umd.min.js`,
				format: 'umd',
				globals: outputs.umd.globals,
			},
			external: outputs.umd.external,
			plugins: [
				replace({
					__DEV__: 'false',
					preventAssignment: true,
				}),
				...plugins,
				terser(),
			],
		},
	],
	browser: [
		{
			input: input.path,
			output: {
				file: `./dist/calendash.${input.name}.browser.mjs`,
				format: 'esm',
			},
			external: outputs.browser.external,
			plugins: [
				replace({
					__DEV__: 'true',
					preventAssignment: true,
				}),
				...plugins,
			],
		},
		{
			input: input.path,
			output: {
				file: `./dist/calendash.${input.name}.browser.min.mjs`,
				format: 'esm',
			},
			external: outputs.browser.external,
			plugins: [
				replace({
					__DEV__: 'false',
					preventAssignment: true,
				}),
				...plugins,
				terser(),
			],
		},
	],
});
