import type { BuilderContext, Decade, DecadeCell } from '../../../../../types';
import { isDateDisabled, isSameDecade, isSameYear, createGrid } from '../../../../../utils/helpers';

/**
 * Builds the "decade" view representation of the calendar.
 *
 * This view generates a 4x3 grid of `DecadeCell` objects representing a 10-year period
 * centered around the target year. Each cell represents a year, enriched with flags
 * for selection, range, and disabled state.
 *
 * @param ctx - Context containing the target date, today's date, bounds, and middlewares.
 *
 * @returns A `Decade` object with:
 *  - `isCurrentDecade`: Indicates if the target decade is the same as today's decade.
 *  - `cells`: A 4x3 grid of `DecadeCell` objects, representing each year in the decade.
 *
 * @example
 * const view = decade({
 *   target: new Date(2025, 0, 1),
 *   today: new Date(),
 *   bounds: { min: ..., max: ... },
 *   middlewares: [...],
 * });
 *
 * view.cells[0][0].year; // 2020 (if 2025 is the target year)
 */
export function decade(ctx: BuilderContext): Decade {
	const { target, today, bounds, middlewares } = ctx;
	const startYear = Math.floor(target.getFullYear() / 10) * 10;
	const current = new Date(target.getTime());
	const decadeCells = createGrid<DecadeCell>(4, 3, (i, j) => {
		const year = startYear + i * 3 + j;
		current.setFullYear(year);
		return {
			timestamp: current.getTime(),
			year,
			isCurrentYear: isSameYear(current, today),
			isOutsideView: !isSameDecade(current, target),
			isSelected: isSameYear(current, target),
			isDisabled: isDateDisabled(current, bounds, middlewares),
		} satisfies DecadeCell;
	});

	return {
		isCurrentDecade: isSameDecade(target, today),
		cells: decadeCells,
	};
}
