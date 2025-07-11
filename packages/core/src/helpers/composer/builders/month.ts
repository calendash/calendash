import type { BuilderContext, Month, MonthCell } from '../../../types';
import { isDateDisabled, isSameDay, isSameMonth, isSameWeek } from '../../../utils/date';
import { createGrid } from '../../../utils/array';

export function month(ctx: BuilderContext): Month {
	const { target, today, bounds, middlewares } = ctx;
	const date = new Date(target.getTime());
	date.setDate(1); // Set first day of month
	const current = new Date(date.getTime());
	current.setDate(current.getDate() - current.getDay());
	const monthCells = createGrid<MonthCell>(6, 7, () => {
		const day = {
			time: current.getTime(),
			day: current.getDate(),
			dayOfWeek: current.getDay(),
			month: current.getMonth(),
			year: current.getFullYear(),
			isCurrentDay: isSameDay(current, today),
			isCurrentWeek: isSameWeek(current, today),
			isOutOfRange: !isSameMonth(current, target),
			isSelected: isSameDay(current, target),
			isDisabled: isDateDisabled(current, bounds, middlewares),
		};
		current.setDate(current.getDate() + 1);
		return day;
	});

	return {
		isCurrentMonth: isSameMonth(target, today),
		cells: monthCells,
	};
}
