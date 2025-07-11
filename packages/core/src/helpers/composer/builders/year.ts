import type { BuilderContext, Grid } from '../../types';
import { isDateDisabled, isSameMonth, isSameYear } from '../../../utils/date';
import { createGrid } from '../../../utils/array';

export type YearCell = {
	time: number;
	month: number;
	year: number;
	isCurrentMonth: boolean;
	isOutOfRange: boolean;
	isSelected: boolean;
	isDisabled: boolean;
};

export type Year = {
	isCurrentYear: boolean;
	cells: Grid<YearCell>;
};

export function year(ctx: BuilderContext): Year {
	const { target, today, bounds, middlewares } = ctx;
	const current = new Date(target.getTime());
	const yearCells = createGrid<YearCell>(4, 3, (i, j) => {
		const monthIndex = i * 3 + j;
		current.setMonth(monthIndex);
		return {
			time: current.getTime(),
			month: monthIndex,
			year: current.getFullYear(),
			isCurrentMonth: isSameMonth(current, today),
			isOutOfRange: !isSameYear(current, target),
			isSelected: isSameMonth(current, target),
			isDisabled: isDateDisabled(current, bounds, middlewares),
		};
	});

	return {
		isCurrentYear: isSameYear(target, today),
		cells: yearCells,
	};
}
