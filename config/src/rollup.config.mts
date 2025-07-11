import type { GlobalsOption, RollupOptions } from 'rollup';
import {
  type FormatOutputs,
  type PluginsOption,
  type InputOption,
  type FormatType,
  normalizeOutputs,
  definePlugins,
  formats,
} from './utils/index.mjs';

type Options = {
	inputs: readonly InputOption[];
	plugins?: PluginsOption;
	globals?: GlobalsOption;
	outputs?: FormatOutputs;
};

export default function (opts: Options): readonly RollupOptions[] {
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