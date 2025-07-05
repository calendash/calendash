import { isSameMonth, isSameYear, type YearCell, type Year, type BuilderContext } from '../utils';
import { buildGrid } from './buildGrid';

export function year(ctx: BuilderContext): Year {
	const { target, today } = ctx;
	const current = new Date(target.getTime());
	const yearCells = buildGrid<YearCell>(4, 3, (i, j) => {
		const monthIndex = i * 3 + j;
		current.setMonth(monthIndex);
		return {
			time: current.getTime(),
			month: monthIndex,
			year: current.getFullYear(),
			isCurrentMonth: isSameMonth(current, today),
			isOutsideRange: !isSameYear(current, target),
			isSelected: isSameMonth(current, target),
			isDisabled: false,
		};
	});

	return {
		isCurrentYear: isSameYear(target, today),
		cells: yearCells,
	};
}
