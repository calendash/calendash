import type { BuilderContext, Decade, DecadeCell } from '../../../types';
import { isDateDisabled, isSameDecade, isSameYear, createGrid } from '../../../utils/helpers';

export function decade(ctx: BuilderContext): Decade {
	const { target, today, bounds, middlewares } = ctx;
	const startYear = Math.floor(target.getFullYear() / 10) * 10;
	const current = new Date(target.getTime());
	const decadeCells = createGrid<DecadeCell>(4, 3, (i, j) => {
		const year = startYear + i * 3 + j;
		current.setFullYear(year);
		return {
			time: current.getTime(),
			year,
			isCurrentYear: isSameYear(current, today),
			isOutOfRange: !isSameDecade(current, target),
			isSelected: isSameYear(current, target),
			isDisabled: isDateDisabled(current, bounds, middlewares),
		};
	});

	return {
		isCurrentDecade: isSameDecade(target, today),
		cells: decadeCells,
	};
}
