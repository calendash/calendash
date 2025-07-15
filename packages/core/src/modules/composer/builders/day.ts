import { isDateDisabled, isSameDay } from '../../../utils/helpers';
import type { BuilderContext, Day, DayCell, Grid } from '../../../types';

/**
 * Builds the "day" view representation of the calendar.
 *
 * This view consists of a single day cell (the `target` date), enriched with metadata
 * such as day of the week, selection state, and whether the date is disabled.
 * It also indicates whether the target date matches "today".
 *
 * @param ctx - Context containing the target date, today's date, bounds, and middlewares.
 *
 * @returns A `Day` object with:
 *  - `isCurrentDay`: Indicates if the target date is the same as today's date.
 *  - `cells`: A 1x1 grid containing a single `DayCell` with detailed date information.
 *
 * @example
 * const view = day({
 *   target: new Date(2025, 0, 1),
 *   today: new Date(),
 *   bounds: { min: ..., max: ... },
 *   middlewares: [...],
 * });
 *
 * view.cells[0][0].day; // 1
 */
export function day(ctx: BuilderContext): Day {
	const { target, today, bounds, middlewares } = ctx;
	const cell: Grid<DayCell> = [
		[
			{
				time: target.getTime(),
				day: target.getDate(),
				dayOfWeek: target.getDay(),
				month: target.getMonth(),
				year: target.getFullYear(),
				isSelected: true,
				isDisabled: isDateDisabled(target, bounds, middlewares),
			},
		],
	];

	return {
		isCurrentDay: isSameDay(target, today),
		cells: cell,
	};
}
