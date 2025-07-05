import { isSameDay, isSameWeek, type WeekCell, type Week, type BuilderContext } from '../utils';
import { buildGrid } from './buildGrid';

export function week(ctx: BuilderContext): Week {
	const { target, today } = ctx;
	const date = new Date(target.getTime());
	date.setDate(date.getDate() - date.getDay());

	const weekCells = buildGrid<WeekCell>(1, 7, (_, j) => {
		const current = new Date(date.getTime());
		current.setDate(current.getDate() + j);
		return {
			time: current.getTime(),
			day: current.getDate(),
			dayOfWeek: current.getDay(),
			month: current.getMonth(),
			year: current.getFullYear(),
			isCurrentDay: isSameDay(current, today),
			isOutsideRange: !isSameWeek(current, target),
			isSelected: isSameDay(target, current),
			isDisabled: false,
		};
	});

	return {
		isCurrentWeek: isSameWeek(target, today),
		cells: weekCells,
	};
}
