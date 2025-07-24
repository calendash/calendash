import type {
	DateBounds,
	DateBoundsRaw,
	DateType,
	DeepPartial,
	Direction,
	ViewOffsets,
} from '../../../../types';
import { DATE_BOUNDARIES } from '../../../../utils/constants';
import { adjustDateTimeZone, isWithinBounds, toDate } from '../../../../utils/helpers';
import { addOffset, getAdjacentDate } from './internal';
import { MomentError, MomentErrorCode } from './moment.error';

export type MomentConfig = {
	/**
	 * Optional target date to initialize the moment with.
	 * Can be a `Date`, timestamp, or ISO string. Defaults to the current date/time.
	 */
	targetDate?: DateType;

	/**
	 * Optional date boundaries (min and/or max) to restrict allowed date ranges.
	 * If the provided target date falls outside these bounds, an error will be thrown.
	 */
	bounds?: DeepPartial<DateBoundsRaw>;
};

/**
 * The Moment class is responsible for managing the current target date
 * and enforcing calendar bounds. It acts as the core source of truth
 * for date state within the calendar system.
 */
export class Moment {
	#date: Date;
	#bounds: DateBounds;

	/**
	 * Gets the current target date.
	 *
	 * @returns The active `Date` instance used as the base for calendar views.
	 */
	get date(): Date {
		return this.#date;
	}

	/**
	 * Gets the current date boundaries.
	 *
	 * @returns An object containing the minimum and maximum allowed dates.
	 */
	get bounds(): DateBounds {
		return this.#bounds;
	}

	constructor(config?: MomentConfig) {
		const { targetDate = Date.now(), bounds: rawBounds } = config ?? {};
		let date, bounds;

		try {
			// Normalize input options
			date = toDate(targetDate);
			bounds = {
				max: toDate(rawBounds?.max ?? DATE_BOUNDARIES.max),
				min: toDate(rawBounds?.min ?? DATE_BOUNDARIES.min),
			};
		} catch (error) {
			throw new MomentError(
				MomentErrorCode.INVALID_DATE,
				`Invalid date provided: ${error instanceof Error ? error.message : String(error)}`
			);
		}

		if (!isWithinBounds(date, bounds)) {
			throw new MomentError(
				MomentErrorCode.OUT_OF_BOUNDS,
				'Target date is outside the specified bounds.'
			);
		}

		this.#date = date;
		this.#bounds = bounds;
	}

	/**
	 * Applies the specified time offsets to the current `Moment` instance's date,
	 * adjusting it by days, weeks, months, etc., as defined in the `viewOffsets` argument.
	 *
	 * The method first calculates a new date by applying the offsets, then checks
	 * if this new date falls within the allowed bounds of the `Moment` instance.
	 * If the new date is within bounds, it updates the internal date; otherwise,
	 * the date remains unchanged.
	 *
	 * @param viewOffsets - A partial mapping of time units (e.g., days, weeks, months)
	 *                      to integer offset values to apply to the current date.
	 *
	 * @returns The current `Moment` instance, enabling method chaining.
	 *
	 * @example
	 * ```ts
	 * const moment = new Moment(new Date('2025-01-01'));
	 * moment.add({ days: 5 });  // Advances the date by 5 days
	 * ```
	 */
	add(viewOffsets: DeepPartial<ViewOffsets>): this {
		const newDate = addOffset(this.#date, viewOffsets);

		if (isWithinBounds(newDate, this.#bounds)) {
			this.#date = newDate;
			return this;
		} else if (__DEV__) {
			console.warn(`[Moment] Attempted to shift to out-of-bounds date: "${newDate.toISOString()}"`);
		}

		return this;
	}

	/**
	 * Adjusts the current date and date range (`max` and `min`) to the specified time zone.
	 *
	 * @param timeZone The IANA time zone identifier (e.g., "America/New_York").
	 * @returns {Moment} The updated instance with the adjusted time zone.
	 * @throws {MomentError} If the given input timeZone is invalid.
	 *
	 * @example
	 * const timeZone = 'America/New_York';
	 * momentInstance.toZonedDateTime(timeZone); // Moment instance adjusted to the New York time zone
	 */
	toZonedDateTime(timeZone: string): this {
		try {
			this.#bounds = {
				max: adjustDateTimeZone(this.#bounds.max, timeZone),
				min: adjustDateTimeZone(this.#bounds.min, timeZone),
			};
			this.#date = adjustDateTimeZone(this.#date, timeZone);
		} catch (error) {
			throw new MomentError(
				MomentErrorCode.INVALID_TIMEZONE,
				`Invalid time zone provided: ${error instanceof Error ? error.message : String(error)}`
			);
		}
		return this;
	}

	/**
	 * Updates the internal date (`year`, `month`, and `day` only) using the provided input.
	 *
	 * This method **mutates** the current `Moment` instance and is used internally
	 * for synchronizing calendar state with a new reference date, without altering
	 * the time components (`hours`, `minutes`, `seconds`, etc.).
	 *
	 * If the input date is out of the allowed range, the update is skipped and a warning is logged.
	 *
	 * @param date The date to synchronize from. Can be a `Date` or `DateType`.
	 * @throws {MomentError} If given input date is invalid.
	 * @returns The current `Moment` instance for chaining.
	 *
	 * @example
	 * moment.from(new Date(2024, 4, 10)); // Updates internal state to May 10, 2024
	 */
	from(date: DateType): this {
		try {
			const newDate = toDate(date);

			if (isWithinBounds(newDate, this.#bounds)) {
				this.#date.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
				return this;
			} else if (__DEV__) {
				console.warn(`[Moment] The new target date is out of bounds: "${newDate.toDateString()}"`);
			}
		} catch (error) {
			throw new MomentError(
				MomentErrorCode.INVALID_DATE,
				`Invalid date provided: ${error instanceof Error ? error.message : String(error)}`
			);
		}

		return this;
	}

	/**
	 * Determines whether shifting the current date by the specified offset type and direction
	 * results in a date that stays within the allowed bounds.
	 *
	 * This method calculates the adjacent date by applying the given offset key
	 * (e.g., 'days', 'months') and navigation direction (`-1` for backward, `1` for forward),
	 * then verifies if this new date lies within the configured bounds of the instance.
	 *
	 * @param offsetKey - The time unit to offset by (a key of `ViewOffsets` such as 'days' or 'months').
	 * @param direction - The navigation direction: `-1` for backward, `1` for forward.
	 * @returns `true` if the calculated adjacent date is within bounds; otherwise, `false`.
	 */
	isAdjacentDateVisible(offsetKey: keyof ViewOffsets, direction: Direction): boolean {
		const newDate = getAdjacentDate(this.#date, offsetKey, direction);
		return isWithinBounds(newDate, this.#bounds);
	}
}
