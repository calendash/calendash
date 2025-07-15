import type { Middleware } from '../types';
import { ISO_DATE_REGEX } from '../utils/constants';
import { getDayKey } from '../utils/helpers';

export type DisableDatesOptions = {
	/**
	 * List of disabled date strings.
	 * Must follow the `'YYYY-MM-DD'` format (e.g., `'2025-07-03'`).
	 */
	listOfDates?: string[];
};

/**
 * Middleware factory to disable specific dates based on a list of date strings.
 *
 * The dates must be in `'YYYY-MM-DD'` format. Invalid formats are silently filtered out.
 * This middleware will disable any calendar cell that matches a date in the list.
 *
 * @param listOfDates - An array of strings representing the disabled dates.
 * @returns A middleware object that marks matching dates as disabled.
 *
 * @example
 * const middleware = disableDates(['2025-07-03', '2025-12-25']);
 *
 * // Internally used by the calendar system
 * middleware.fn({ date: new Date(2025, 6, 3) }).data.isDisabled; // true
 */
export const disableDates = (options: DisableDatesOptions = {}): Middleware => {
	const filteredList = Array.isArray(options.listOfDates)
		? options.listOfDates.filter((str) => ISO_DATE_REGEX.test(str))
		: [];
	const disabledDateSet = new Set(filteredList);

	return {
		name: 'disableDates',
		options,
		fn(state) {
			const { date } = state;
			const isDisabled = disabledDateSet.has(getDayKey(date));

			return {
				data: { isDisabled },
			};
		},
	};
};
