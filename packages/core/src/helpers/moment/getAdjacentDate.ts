import type { Direction, ViewOffsets } from '../../types';
import { DIRECTION_NEXT, DIRECTION_PREV } from '../../utils/constants';
import { clamp, isInteger } from '../../utils/numeric';

type ViewOffsetKey = keyof ViewOffsets;
type ViewOffsetHandler = (date: Date, offset: number) => void;

/**
 * Mapping of view offset keys to their corresponding handler functions.
 *
 * Each handler function modifies the provided `Date` by adding or subtracting
 * the given offset in the respective time unit.
 *
 * - `decades`: Adjusts the year by offset * 10.
 * - `years`: Adjusts the year by offset.
 * - `months`: Adjusts the month by offset.
 * - `weeks`: Adjusts the date by offset * 7 days.
 * - `days`: Adjusts the date by offset.
 *
 * @example
 * dateOffsetStrategies.years(new Date(2025, 0, 1), 2); // Advances date by 2 years
 */
const dateOffsetStrategies: Record<ViewOffsetKey, ViewOffsetHandler> = {
	decades: (date, offset) => {
		date.setFullYear(date.getFullYear() + offset * 10);
	},
	years: (date, offset) => {
		date.setFullYear(date.getFullYear() + offset);
	},
	months: (date, offset) => {
		date.setMonth(date.getMonth() + offset);
	},
	weeks: (date, offset) => {
		date.setDate(date.getDate() + offset * 7);
	},
	days: (date, offset) => {
		date.setDate(date.getDate() + offset);
	},
} as const;

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
