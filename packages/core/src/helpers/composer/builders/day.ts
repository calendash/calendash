import { isSameDay } from '../../../common';
import { type BuilderContext, type Grid, isDateDisabled } from '../utils';

type DayCell = {
	time: number;
	day: number;
	dayOfWeek: number;
	month: number;
	year: number;
	isSelected: boolean;
	isDisabled: boolean;
};

type Day = {
	isCurrentDay: boolean;
	cells: Grid<DayCell>;
};

function day(ctx: BuilderContext): Day {
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

export { day, type DayCell, type Day };
