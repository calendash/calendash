import type { RollupOptions, GlobalsOption } from 'rollup';
import {
  type FormatOutputs,
  FormatType,
  normalizeOutputs
} from './normalize.mjs';
import {
  type PluginsOption,
  definePlugins
} from './plugins.mjs'
import {
  type InputOption,
  formats
} from './formats.mjs';

type Options = {
	inputs: readonly InputOption[];
	plugins?: PluginsOption;
	globals?: GlobalsOption;
	outputs?: FormatOutputs;
};

export function config(opts: Options): readonly RollupOptions[] {
  const {inputs, globals, outputs: outputOpts, plugins: pluginsOpts} = opts;
  const outputs = normalizeOutputs(outputOpts, globals);
  const plugins = definePlugins(pluginsOpts);

  return inputs.flatMap(input => {
    const inputFormats = formats(input, outputs, plugins);
    return Object.entries(inputFormats).flatMap(([key, value]) =>
      outputs[key as FormatType].skip ? [] : value
    );
  });
}