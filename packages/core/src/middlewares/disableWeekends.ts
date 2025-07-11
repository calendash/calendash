import { getDayKey, type Middleware } from '../common';

/**
 * Options for the `disableWeekends` middleware.
 *
 * @property exclude - An optional list of date strings in `'YYYY-MM-DD'` format to exclude from being disabled.
 */
type DisableWeekendsOptions = {
	exclude?: string[];
};

/**
 * Middleware to disable all weekends (Saturday and Sunday),
 * with optional support for excluding specific weekend dates.
 *
 * @param options - Optional configuration to exclude specific weekend dates from being disabled.
 * @returns A middleware object that marks weekends as disabled, except those in the `exclude` list.
 *
 * @example
 * const middleware = disableWeekends({ exclude: ['2025-07-05'] });
 *
 * middleware.fn({ date: new Date(2025, 6, 5) }).data.isDisabled; // false if excluded
 */
const disableWeekends = (options: DisableWeekendsOptions = {}): Middleware => {
	const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
	const exclude = Array.isArray(options.exclude)
		? options.exclude.filter((str) => ISO_DATE_REGEX.test(str))
		: [];

	const excludedDateSet = new Set(exclude);

	return {
		name: 'disableWeekends',
		options,
		fn(state) {
			const { date } = state;
			const dayOfWeek = date.getDay(); // Sunday = 0, Saturday = 6
			const key = getDayKey(date);
			const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
			const isExcluded = excludedDateSet.has(key);

			return {
				data: {
					isDisabled: isWeekend && !isExcluded,
				},
			};
		},
	};
};

export { disableWeekends, type DisableWeekendsOptions };
