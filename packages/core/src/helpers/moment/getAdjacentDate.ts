import type { Direction, ViewOffsets } from '../../types';
import { DIRECTION_NEXT, DIRECTION_PREV } from '../../utils/constants';
import { clamp, isInteger } from '../../utils/numeric';
import { dateOffsetStrategies } from './dateOffsetStrategies';

/**
 * Calculates a new date adjacent to the given date by applying an offset in a specified direction.
 *
 * The offset is determined by the `offsetKey` (e.g., 'days', 'months'), and the direction
 * indicates whether to move backward (`-1`) or forward (`1`) by one unit of that offset.
 *
 * @param date - The original date from which to calculate the adjacent date.
 * @param offsetKey - The key specifying the type of time offset to apply (must be a key of `ViewOffsets`).
 * @param direction - The direction to apply the offset: `-1` for backward, `1` for forward.
 *
 * @returns A new `Date` object representing the adjacent date after applying the offset.
 *
 * @throws Will throw an error if the `offsetKey` does not correspond to a valid offset handler.
 * @throws Will throw an error if `direction` is not an integer (expected values: `-1` or `1`).
 *
 * @example
 * ```ts
 * const date = new Date('2025-03-21');
 * const nextDay = getAdjacentDate(date, 'days', 1); // Returns March 22, 2025
 * const prevMonth = getAdjacentDate(date, 'months', -1); // Returns February 21, 2025
 * ```
 */
export function getAdjacentDate(
	date: Date,
	offsetKey: keyof ViewOffsets,
	direction: Direction
): Date {
	const strategy = dateOffsetStrategies[offsetKey];

	if (typeof strategy !== 'function') {
		// TODO: Create dedicated exception
		throw new Error(`Invalid offset strategy for key "${offsetKey}".`);
	}

	if (!isInteger(direction)) {
		// TODO: Create dedicated exception
		throw new Error('Direction must be an integer (-1 or 1).');
	}

	const target = new Date(date.getTime());
	strategy(target, clamp(direction, DIRECTION_PREV, DIRECTION_NEXT));
	return target;
}
