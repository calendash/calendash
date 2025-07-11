import type { Plugin } from 'rollup';
import type { PluginsOption } from './types.mjs';
import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';

export default (plugins?: PluginsOption): readonly Plugin[] =>{
	const { node: nodeOverride, babel: babelOverride, ...restOfPlugins } = plugins ?? {};
	const pluginOverrides = Object.values(restOfPlugins).filter((plugin): plugin is Plugin =>
		Boolean(plugin)
	);

	return [
		...pluginOverrides,
		nodeOverride ?? nodeResolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
		babelOverride ??
			babel({
				babelHelpers: 'bundled',
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
				plugins: [
					// babel-plugin-annotate-pure-calls
					'annotate-pure-calls',
				],
			}),
	];
};