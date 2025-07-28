import type { Middleware } from '../types';
import { ISO_DATE_REGEX } from '../utils/constants';
import { getDayKey } from '../utils/helpers';

/**
 * Options for disabling specific dates in the calendar.
 */
export type DisableOptions = {
	/**
	 * List of dates to disable (format: 'YYYY-MM-DD').
	 */
	dates?: string[];

	/**
	 * If true, disables weekends (Saturday and Sunday).
	 */
	weekends?: boolean;

	/**
	 * Dates to exclude from being disabled,
	 * even if listed in `dates` or fall on a weekend.
	 */
	exclude?: string[];
};

const getStringItems = (array?: string[]) =>
	Array.isArray(array)
		? array.filter((elem) => typeof elem === 'string' && ISO_DATE_REGEX.test(elem))
		: [];

/**
 * Creates a middleware to disable specific dates or weekends in a calendar.
 *
 * This middleware disables:
 * - Exact dates listed in the `dates` option (must follow `'YYYY-MM-DD'` format).
 * - Optionally, weekends (`Saturday` and `Sunday`) if the `weekends` flag is set to `true`.
 *
 * You can use the `exclude` list to prevent specific dates from being disabled,
 * **even if they fall on a weekend**. This is useful for overriding the `weekends` rule.
 *
 * @example
 * disable({
 *   dates: ['2025-12-25', '2025-01-01'], // Disable Christmas and New Year
 *   weekends: true,                      // Also disable Saturdays and Sundays
 *   exclude: ['2025-12-28']              // But allow Dec 28, even if it's a Sunday
 * });
 *
 * @param options - Configuration options to control disabled dates.
 * @param options.dates - List of exact dates to disable in `'YYYY-MM-DD'` format.
 * @param options.weekends - If `true`, disables all Saturdays and Sundays.
 * @param options.exclude - List of dates (also in `'YYYY-MM-DD'` format) to explicitly exclude
 *   from being disabled — **overrides the `weekends` rule**.
 *
 * @returns A middleware object that evaluates whether a given date should be marked as disabled.
 */
export const disable = (options: DisableOptions = {}): Middleware => {
	const { dates, exclude, weekends = false } = options;

	const dateSet = new Set(getStringItems(dates));
	const excludeSet = weekends && exclude?.length ? new Set(getStringItems(exclude)) : null;

	return {
		name: 'disable',
		options,
		fn(state) {
			const { date } = state;
			const key = getDayKey(date);

			// Case 1: Exact match
			if (dateSet.has(key)) return { data: { isDisabled: true } };

			// Case 2: Weekend check (if enabled)
			if (weekends) {
				const isWeekend = date.getDay() === 0 || date.getDay() === 6;
				const isExcluded = excludeSet?.has(key) ?? false;

				if (isWeekend && !isExcluded) {
					return { data: { isDisabled: true } };
				}
			}

			return { data: { isDisabled: false } };
		},
	};
};
