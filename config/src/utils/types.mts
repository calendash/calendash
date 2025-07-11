import type { GlobalsOption, ExternalOption, Plugin } from 'rollup';
import type { FORMATS } from './constants.mjs';

type OutputProps = {
	globals?: GlobalsOption;
};

export type PluginsOption = {
	node?: Plugin;
	babel?: Plugin;
	[key: string]: Plugin | undefined;
};
export type InputOption = {
	path: string;
	name: string;
	entry: string;
};
export type NormalizedProps = OutputProps & {
	skip: boolean;
	external?: ExternalOption;
};
export type FormatType = (typeof FORMATS)[number];
export type FormatOutputs = Partial<Record<FormatType, OutputProps | false>>;
export type NormalizedOutputs = Record<FormatType, NormalizedProps>;
