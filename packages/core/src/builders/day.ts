import { isSameDay, type BuilderContext, type Day } from '../utils';

export function day(ctx: BuilderContext): Day {
	const { target, today } = ctx;
	return {
		isCurrentDay: isSameDay(target, today),
		cells: [
			[
				{
					time: target.getTime(),
					day: target.getDate(),
					dayOfWeek: target.getDay(),
					month: target.getMonth(),
					year: target.getFullYear(),
					isSelected: true,
					isDisabled: false,
				},
			],
		],
	};
}
