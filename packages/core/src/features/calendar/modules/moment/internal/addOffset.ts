import type { DeepPartial, ViewOffsets } from '../../../../../types';
import { isInteger, isPlainObject } from '../../../../../utils/helpers';
import { MomentError, MomentErrorCode } from '../moment.error';
import { dateOffsetStrategies } from './dateOffsetStrategies';

/**
 * Applies a set of view offsets to a given date, returning a new adjusted `Date` object.
 *
 * Each offset corresponds to a unit of time (e.g., days, weeks, months) and will be applied
 * using the appropriate handler function. The original date is not mutated.
 *
 * @param date - The original `Date` to which the offsets will be applied.
 * @param viewOffsets - A partial mapping of view offset keys to integer offset values.
 *                      The keys should correspond to units like 'days', 'weeks', 'months', etc.
 *
 * @throws {MomentError} Will throw an error if:
 * - `viewOffsets` is not a plain object.
 * - Any offset value is not an integer.
 *
 * @returns A new `Date` instance with all specified offsets applied.
 *
 * @example
 * const baseDate = new Date('2025-01-01');
 * const newDate = addOffset(baseDate, { days: 5, months: -1 });
 * // newDate is '2024-12-06'
 */
export function addOffset(date: Date, viewOffsets: DeepPartial<ViewOffsets>): Date {
	const newDate = new Date(date.getTime());

	if (!isPlainObject(viewOffsets)) {
		throw new MomentError(
			MomentErrorCode.INVALID_INPUT_OFFSET,
			'Invalid view offset. Expected a plain object.'
		);
	}

	for (const [key, offset] of Object.entries(viewOffsets)) {
		const fn = dateOffsetStrategies[key as keyof ViewOffsets];

		// Ignore unknown offset key
		if (typeof fn !== 'function') continue;

		if (!isInteger(offset)) {
			throw new MomentError(
				MomentErrorCode.INVALID_DIRECTION,
				`Invalid offset direction "${offset}". Expected an integer value.`
			);
		}

		fn(newDate, offset);
	}

	return newDate;
}
