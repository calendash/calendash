import type { BuilderContext, Grid } from '../../types';
import { isDateDisabled, isSameDecade, isSameYear } from '../../../utils/date';
import { createGrid } from '../../../utils/array';

export type DecadeCell = {
	time: number;
	year: number;
	isCurrentYear: boolean;
	isOutOfRange: boolean;
	isSelected: boolean;
	isDisabled: boolean;
};

export type Decade = {
	isCurrentDecade: boolean;
	cells: Grid<DecadeCell>;
};

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
