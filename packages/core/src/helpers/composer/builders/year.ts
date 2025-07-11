import { isSameMonth, isSameYear, type Year, type YearCell } from '../../../common';
import { buildGrid, isDateDisabled, type BuilderContext } from '../utils';

function year(ctx: BuilderContext): Year {
	const { target, today, bounds, middlewares } = ctx;
	const current = new Date(target.getTime());
	const yearCells = buildGrid<YearCell>(4, 3, (i, j) => {
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

export { year, type YearCell, type Year };
