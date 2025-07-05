import {
	isSameDay,
	isSameWeek,
	isSameMonth,
	type Month,
	type BuilderContext,
	type MonthCell,
} from '../utils';
import { buildGrid } from './buildGrid';

export function month(ctx: BuilderContext): Month {
	const { target, today } = ctx;
	const date = new Date(target.getTime());
	date.setDate(1); // Set first day of month
	const current = new Date(date.getTime());
	current.setDate(current.getDate() - current.getDay());
	const monthCells = buildGrid<MonthCell>(6, 7, () => {
		const day = {
			time: current.getTime(),
			day: current.getDate(),
			dayOfWeek: current.getDay(),
			month: current.getMonth(),
			year: current.getFullYear(),
			isCurrentDay: isSameDay(current, today),
			isCurrentWeek: isSameWeek(current, today),
			isOutsideRange: !isSameMonth(current, target),
			isSelected: isSameDay(current, target),
			isDisabled: false,
		};
		current.setDate(current.getDate() + 1);
		return day;
	});

	return {
		isCurrentMonth: isSameMonth(target, today),
		cells: monthCells,
	};
}
