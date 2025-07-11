import { isWithinBounds, type Middleware, type DateBounds } from '../../../common';

/**
 * Determines whether a given date should be marked as disabled.
 *
 * This function checks two conditions:
 * 1. Whether the date falls outside the specified bounds.
 * 2. Whether any of the provided middleware functions (whose names start with "disable")
 *    return a result indicating that the date is disabled.
 *
 * @param date - The date to evaluate.
 * @param bounds - The valid date range (`min` and `max`) used to restrict selection.
 * @param middlewares - Optional array of middleware functions that may apply custom rules to disable dates.
 *
 * @returns `true` if the date is outside the bounds or marked as disabled by a middleware; otherwise, `false`.
 *
 * @example
 * const disabled = isDateDisabled(new Date(), bounds, [
 *   { name: 'disableWeekends', fn: ({ date }) => ({ data: { isDisabled: isWeekend(date) } }) }
 * ]);
 */
export function isDateDisabled(
	date: Date,
	bounds: DateBounds,
	middlewares: Middleware[] = []
): boolean {
	if (!isWithinBounds(date, bounds)) return true;

	for (const mw of middlewares) {
		if (mw.name.startsWith('disable') && mw.fn({ date }).data?.isDisabled) {
			return true;
		}
	}

	return false;
}
