import type { BuilderContext, Day, DayCell, Grid } from '../../../types';
import { isDateDisabled, isSameDay } from '../../../utils/date';

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
