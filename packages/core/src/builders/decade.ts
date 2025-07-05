import {
	isSameYear,
	isSameDecade,
	type DecadeCell,
	type Decade,
	type BuilderContext,
} from '../utils';
import { buildGrid } from './buildGrid';

export function decade(ctx: BuilderContext): Decade {
	const { target, today } = ctx;
	const startYear = Math.floor(target.getFullYear() / 10) * 10;
	const current = new Date(target.getTime());
	const decadeCells = buildGrid<DecadeCell>(4, 3, (i, j) => {
		const year = startYear + i * 3 + j;
		current.setFullYear(year);
		return {
			time: current.getTime(),
			year,
			isCurrentYear: isSameYear(current, today),
			isOutsideRange: !isSameDecade(current, target),
			isSelected: isSameYear(current, target),
			isDisabled: false,
		};
	});

	return {
		isCurrentDecade: isSameDecade(target, today),
		cells: decadeCells,
	};
}
