import type { GlobalsOption } from 'rollup';
import { FORMATS } from './constants.mjs';
import type { FormatOutputs, FormatType, NormalizedOutputs, NormalizedProps } from './types.mjs';

export default (outputs?: FormatOutputs, globals?: GlobalsOption): NormalizedOutputs =>
	FORMATS.reduce(
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
