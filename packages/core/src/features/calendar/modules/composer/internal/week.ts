import type { BuilderContext, Week, WeekCell } from '../../../../../types';
import { isDateDisabled, isSameDay, isSameWeek, createGrid } from '../../../../../utils/helpers';

/**
 * Builds the "week" view representation of the calendar.
 *
 * This view generates a 1x7 grid of `WeekCell` objects representing the seven days
 * of the week containing the target date. The week always starts on Sunday.
 *
 * Each cell is enriched with metadata such as selection state, whether it's the current day,
 * and whether it falls outside the target week or is disabled by middleware.
 *
 * @param ctx - Context containing the target date, today's date, bounds, and disableMiddleware.
 *
 * @returns A `Week` object with:
 *  - `isCurrentWeek`: Indicates whether the target date falls in the current week.
 *  - `cells`: A 1x7 grid of `WeekCell` objects representing the days in the week.
 *
 * @example
 * const view = week({
 *   target: new Date(2025, 6, 16), // Wednesday
 *   today: new Date(),
 *   bounds: { min: ..., max: ... },
 *   disableMiddleware: { name: ..., fn: ... },
 * });
 *
 * view.cells[0][0].day; // Sunday of that week
 */
export function week(ctx: BuilderContext): Week {
	const { target, today, bounds, disableMiddleware } = ctx;
	const date = new Date(target.getTime());
	date.setDate(date.getDate() - date.getDay());

	const weekCells = createGrid<WeekCell>(1, 7, (_, j) => {
		const current = new Date(date.getTime());
		current.setDate(current.getDate() + j);
		return {
			timestamp: current.getTime(),
			dayOfMonth: current.getDate(),
			weekday: current.getDay(),
			monthIndex: current.getMonth(),
			year: current.getFullYear(),
			isCurrentDay: isSameDay(current, today),
			isSelected: isSameDay(target, current),
			isDisabled: isDateDisabled(current, bounds, disableMiddleware),
		} satisfies WeekCell;
	});

	return {
		isCurrentWeek: isSameWeek(target, today),
		cells: weekCells,
	};
}
