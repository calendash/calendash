import type { BuilderContext, Year, YearCell } from '../../../../../types';
import { isDateDisabled, isSameMonth, isSameYear, createGrid } from '../../../../../utils/helpers';

/**
 * Builds the "year" view representation of the calendar.
 *
 * This view consists of a 4x3 grid of `YearCell` objects, each representing a month
 * of the target year (January to December). Each cell includes flags for whether
 * the month is selected, is the current month, is outside the target year, or is disabled.
 *
 * @param ctx - Context containing the target date, today's date, bounds, and middlewares.
 *
 * @returns A `Year` object with:
 *  - `isCurrentYear`: Indicates whether the target year is the same as the current year.
 *  - `cells`: A 4x3 grid of `YearCell` objects representing all months in the year.
 *
 * @example
 * const view = year({
 *   target: new Date(2025, 3, 1), // Any date in 2025
 *   today: new Date(),
 *   bounds: { min: ..., max: ... },
 *   middlewares: [...],
 * });
 *
 * view.cells[0][0].month; // 0 (January)
 */
export function year(ctx: BuilderContext): Year {
	const { target, today, bounds, middlewares } = ctx;
	const current = new Date(target.getTime());
	const yearCells = createGrid<YearCell>(4, 3, (i, j) => {
		const monthIndex = i * 3 + j;
		current.setMonth(monthIndex);
		return {
			timestamp: current.getTime(),
			monthIndex: monthIndex,
			year: current.getFullYear(),
			isCurrentMonth: isSameMonth(current, today),
			isSelected: isSameMonth(current, target),
			isDisabled: isDateDisabled(current, bounds, middlewares),
		} satisfies YearCell;
	});

	return {
		isCurrentYear: isSameYear(target, today),
		cells: yearCells,
	};
}
