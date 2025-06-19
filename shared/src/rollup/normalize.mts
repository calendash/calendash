import type { GlobalsOption, ExternalOption } from 'rollup';

const FORMATS = ['esm', 'mjs', 'cjs', 'umd', 'browser'] as const;

type OutputProps = {
	globals?: GlobalsOption;
};

type NormalizedProps = OutputProps & {
	skip: boolean;
	external?: ExternalOption;
};

export type FormatType = (typeof FORMATS)[number];
export type FormatOutputs = Partial<Record<FormatType, OutputProps | false>>;
export type NormalizedOutputs = Record<FormatType, NormalizedProps>;

export function normalizeOutputs(outputs?: FormatOutputs, globals?: GlobalsOption): NormalizedOutputs {
  return FORMATS.reduce(
		(acc, format) => {
			// Get current output config options
			const formatOptions = outputs?.[format];

			// if current format is set tu false, then skip it
			if (formatOptions === false) {
				return { ...acc, [format]: { skip: true } };
			}

			const { globals: formatGlobals = globals } = formatOptions ?? {};
			return {
				...acc,
				[format]: {
					skip: false,
					globals: formatGlobals,
					external: !!formatGlobals ? Object.keys(formatGlobals) : undefined,
				},
			};
		},
		{} as Record<FormatType, NormalizedProps>
	);
}