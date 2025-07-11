import { getDayKey, type Middleware } from '../common';

/**
 * Type definition for the list of disabled date strings.
 * Must follow the `'YYYY-MM-DD'` format (e.g., `'2025-07-03'`).
 */
type DisableDatesOptions = string[];

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
const disableDates = (listOfDates: DisableDatesOptions = []): Middleware => {
	const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
	const filteredList = listOfDates.filter((dateStr) => ISO_DATE_REGEX.test(dateStr));
	const disabledDateSet = new Set(filteredList);

	return {
		name: 'disableDates',
		options: { listOfDates },
		fn(state) {
			const { date } = state;
			const isDisabled = disabledDateSet.has(getDayKey(date));

			return {
				data: { isDisabled },
			};
		},
	};
};

export { disableDates, type DisableDatesOptions };
