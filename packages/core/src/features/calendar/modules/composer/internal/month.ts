import type { BuilderContext, Month, MonthCell } from '../../../../../types';
import {
	isDateDisabled,
	isSameDay,
	isSameMonth,
	isSameWeek,
	createGrid,
} from '../../../../../utils/helpers';

/**
 * Builds the "month" view representation of the calendar.
 *
 * This view consists of a 6x7 grid (42 days), starting from the first visible Sunday before
 * or on the 1st day of the target month. Each cell represents a single day, enriched with
 * metadata such as whether it is part of the current month, week, or day, and whether it is disabled.
 *
 * @param ctx - Context object containing the target date, today's date, bounds, and disableMiddleware.
 *
 * @returns A `Month` object with:
 *  - `isCurrentMonth`: Indicates whether the target month is the same as the current month.
 *  - `cells`: A 6x7 grid of `MonthCell` objects representing each visible day in the month view.
 *
 * @example
 * const view = month({
 *   target: new Date(2025, 6, 15), // July 15, 2025
 *   today: new Date(),
 *   bounds: { min: ..., max: ... },
 *   disableMiddleware: { name: ..., fn: ... },
 * });
 *
 * view.cells[0][0].day; // May be late June, depending on the weekday of July 1st
 */
export function month(ctx: BuilderContext): Month {
	const { target, today, bounds, disableMiddleware } = ctx;
	const date = new Date(target.getTime());
	date.setDate(1); // Set first day of month
	const current = new Date(date.getTime());
	current.setDate(current.getDate() - current.getDay());
	const monthCells = createGrid<MonthCell>(6, 7, () => {
		const day: MonthCell = {
			timestamp: current.getTime(),
			dayOfMonth: current.getDate(),
			weekday: current.getDay(),
			monthIndex: current.getMonth(),
			year: current.getFullYear(),
			isCurrentDay: isSameDay(current, today),
			isCurrentWeek: isSameWeek(current, today),
			isOutsideView: !isSameMonth(current, target),
			isSelected: isSameDay(current, target),
			isDisabled: isDateDisabled(current, bounds, disableMiddleware),
		};
		current.setDate(current.getDate() + 1);
		return day;
	});

	return {
		isCurrentMonth: isSameMonth(target, today),
		cells: monthCells,
	};
}
