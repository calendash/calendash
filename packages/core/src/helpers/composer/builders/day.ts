import { isDateDisabled, isSameDay } from '../../../utils/date';
import type { BuilderContext, Grid } from '../../types';

export type DayCell = {
	time: number;
	day: number;
	dayOfWeek: number;
	month: number;
	year: number;
	isSelected: boolean;
	isDisabled: boolean;
};

export type Day = {
	isCurrentDay: boolean;
	cells: Grid<DayCell>;
};

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
