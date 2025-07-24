import type { DateBounds, Middleware, Grid } from '../types';
import { DATE_FORMAT_OPTS, MAX_CACHE_SIZE } from './constants';

//-----------------------------------------------
//  Date helpers
//-----------------------------------------------

/**
 * Checks if the given value is a valid Date object.
 *
 * This function verifies two conditions:
 * 1. The value is an instance of the Date class.
 * 2. The Date object represents a valid date (i.e., `date.getTime()` does not return NaN).
 *
 * @param date The value to be checked.
 * @returns `true` if the value is a valid Date object, otherwise `false`.
 *
 * @example
 * isDate(new Date()); // true
 * isDate(new Date('invalid date')); // false
 * isDate('2024-03-24'); // false
 */
export function isDate(date: unknown): date is Date {
	if (!(date instanceof Date)) return false;
	// Using isNaN() to check if date.getTime() produces a valid number.
	// This ensures the Date object represents a valid date, not an invalid one like "Invalid Date".
	return !isNaN(date.getTime());
}

/**
 * Checks whether a given `Date` falls within a specified date bounds (inclusive).
 *
 * The date is considered within bounds if it is equal to, or falls between,
 * the `min` and `max` dates (inclusive).
 *
 * @param date - The `Date` to evaluate.
 * @param bounds - A `DateBounds` object with `min` and `max` properties defining the valid range.
 * @returns `true` if the date is within bounds; otherwise, `false`.
 *
 * @example
 * const date = new Date('2025-03-21');
 * const bounds: DateBounds = {
 *   min: new Date('2025-03-01'),
 *   max: new Date('2025-03-31'),
 * };
 * isWithinBounds(date, bounds); // true
 */
export function isWithinBounds(date: Date, bounds: DateBounds): boolean {
	const time = date.getTime();
	return time >= bounds.min.getTime() && time <= bounds.max.getTime();
}

function createAdjustDateTimeZone() {
	const formatterCache = new Map<string, Intl.DateTimeFormat>();

	const setWithLimit = (key: string, formatter: Intl.DateTimeFormat) => {
		if (formatterCache.size >= MAX_CACHE_SIZE) {
			const oldestKey = formatterCache.keys().next().value;
			if (oldestKey) formatterCache.delete(oldestKey);
		}
		formatterCache.set(key, formatter);
	};

	/**
	 * Adjusts a given date to the specified time zone without changing the actual timestamp.
	 *
	 * This function uses `Intl.DateTimeFormat` to format the date in the desired time zone,
	 * extracts the individual date and time components, and reconstructs a new `Date` object
	 * representing the same local time in the specified time zone.
	 *
	 * @param date The date to adjust to the specified time zone.
	 * @param timeZone The IANA time zone identifier (e.g., 'America/New_York', 'UTC').
	 * @returns A new `Date` object representing the adjusted time in the specified time zone.
	 *
	 * @throws Will throw an error if the time zone is invalid or if the date conversion fails.
	 *
	 * @example
	 * const date = new Date('2025-03-24T12:00:00Z');
	 * adjustTimeZone(date, 'America/New_York'); // Returns the date and time in the New York time zone
	 */
	return function (date: Date, timeZone: string): Date {
		let formatter = formatterCache.get(timeZone);
		if (!formatter) {
			formatter = new Intl.DateTimeFormat('en-US', {
				...DATE_FORMAT_OPTS,
				timeZone,
			});
			setWithLimit(timeZone, formatter);
		}

		const parts = formatter.formatToParts(date);
		const entries = parts.map(({ type, value }) => [type, value]);
		const { year, month, day, hour, minute, second } = Object.fromEntries(entries);

		return new Date(
			+year,
			+month - 1, // Set month index
			+day,
			hour === '24' ? 0 : +hour, // Normalize 24 hour string
			+minute,
			+second
		);
	};
}

export const adjustDateTimeZone = createAdjustDateTimeZone();

/**
 * Converts a given value to a `Date` object.
 *
 * @param value The value to be converted. Can be a `Date`, `string`, or `number`.
 * @returns A valid `Date` object.
 * @throws {Error} If the value is an invalid date or an unsupported type.
 *
 * @example
 * toDate('2025-03-21'); // Returns a Date object representing March 21, 2025
 * toDate(1679654400000); // Returns a Date object from a timestamp
 * toDate(new Date()); // Returns the same Date object
 * toDate('invalid-date'); // Throws an Error
 */
export function toDate(value: unknown): Date {
	if (isDate(value)) return value;
	if (typeof value !== 'string' && typeof value !== 'number') {
		throw new Error('Unsupported type for Date conversion. Expected string or number.');
	}

	const date = new Date(value);
	if (isNaN(date.getTime())) {
		throw new Error('Could not convert to Date object.');
	}

	return date;
}

/**
 * Compares two Date objects to check if they represent the same calendar day.
 *
 * This function only compares the year, month, and day values of the dates,
 * ignoring the time component (hours, minutes, seconds, and milliseconds).
 *
 * @param date1 The first Date object to compare.
 * @param date2 The second Date object to compare.
 * @returns Returns `true` if both dates represent the same calendar day, otherwise `false`.
 *
 * @example
 * const date1 = new Date('2025-03-24T10:00:00');
 * const date2 = new Date('2025-03-24T22:00:00');
 * isSameDay(date1, date2); // true
 *
 * const date3 = new Date('2025-03-25T00:00:00');
 * isSameDay(date1, date3); // false
 */
export function isSameDay(date1: Date, date2: Date): boolean {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}

/**
 * Checks if two dates belong to the same decade.
 *
 * A decade is considered as a period of 10 years (e.g., 2020-2029).
 *
 * @param date1 The first date to compare.
 * @param date2 The second date to compare.
 * @returns `true` if both dates belong to the same decade, otherwise `false`.
 *
 * @example
 * isSameDecade(new Date('2023-05-15'), new Date('2027-09-10')); // true
 * isSameDecade(new Date('1999-12-31'), new Date('2000-01-01')); // false
 */
export function isSameDecade(date1: Date, date2: Date): boolean {
	return (date1.getFullYear() / 10) >> 0 === (date2.getFullYear() / 10) >> 0;
}

/**
 * Compares two Date objects to check if they represent dates within the same month and year.
 *
 * This function only compares the year and month values of the dates,
 * ignoring the day and time components.
 *
 * @param date1 The first Date object to compare.
 * @param date2 The second Date object to compare.
 * @returns Returns `true` if both dates are in the same month and year, otherwise `false`.
 *
 * @example
 * const date1 = new Date('2025-03-01');
 * const date2 = new Date('2025-03-24');
 * isSameMonth(date1, date2); // true
 *
 * const date3 = new Date('2025-04-01');
 * isSameMonth(date1, date3); // false
 */
export function isSameMonth(date1: Date, date2: Date): boolean {
	return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}

/**
 * Checks if two dates fall within the same calendar week.
 *
 * This function considers the start of the week (Sunday) and ensures
 * that both dates belong to the same week by adjusting for their respective day offsets.
 *
 * @param date1 The first date to compare.
 * @param date2 The second date to compare.
 * @returns Returns `true` if both dates belong to the same week, otherwise `false`.
 *
 * @example
 * isSameWeek(new Date('2024-03-25'), new Date('2024-03-31'), 1); // true (Monday-based week)
 * isSameWeek(new Date('2024-03-31'), new Date('2024-04-01'), 0); // false (Sunday-based week)
 */
export function isSameWeek(date1: Date, date2: Date): boolean {
	const dayOffset1 = (date1.getDay() + 7) % 7;
	const dayOffset2 = (date2.getDay() + 7) % 7;

	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() - dayOffset1 === date2.getDate() - dayOffset2
	);
}

/**
 * Compares two Date objects to check if they represent dates within the same year.
 *
 * This function only compares the year values of the dates,
 * ignoring the month, day, and time components.
 *
 * @param date1 The first Date object to compare.
 * @param date2 The second Date object to compare.
 * @returns Returns `true` if both dates are in the same year, otherwise `false`.
 *
 * @example
 * const date1 = new Date('2025-03-01');
 * const date2 = new Date('2025-11-24');
 * isSameYear(date1, date2); // true
 *
 * const date3 = new Date('2026-01-01');
 * isSameYear(date1, date3); // false
 */
export function isSameYear(date1: Date, date2: Date): boolean {
	return date1.getFullYear() === date2.getFullYear();
}

/**
 * Converts a given `Date` object to a string key in `'YYYY-MM-DD'` format.
 *
 * This version uses the local time zone (not UTC) and zero-pads month and day values.
 *
 * @param date - The date to convert.
 * @returns A string representation in the form `'YYYY-MM-DD'`.
 *
 * @example
 * getDayKey(new Date(2025, 6, 3)); // '2025-07-03'
 */
export const getDayKey = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

/**
 * Determines whether a given date should be marked as disabled.
 *
 * This function checks two conditions:
 * 1. Whether the date falls outside the specified bounds.
 * 2. Whether any of the provided middleware functions (whose names start with "disable")
 *    return a result indicating that the date is disabled.
 *
 * @param date - The date to evaluate.
 * @param bounds - The valid date range (`min` and `max`) used to restrict selection.
 * @param middlewares - Optional array of middleware functions that may apply custom rules to disable dates.
 *
 * @returns `true` if the date is outside the bounds or marked as disabled by a middleware; otherwise, `false`.
 *
 * @example
 * const disabled = isDateDisabled(new Date(), bounds, [
 *   { name: 'disableWeekends', fn: ({ date }) => ({ data: { isDisabled: isWeekend(date) } }) }
 * ]);
 */
export function isDateDisabled(
	date: Date,
	bounds: DateBounds,
	middlewares: Middleware[] = []
): boolean {
	if (!isWithinBounds(date, bounds)) return true;

	for (const mw of middlewares) {
		if (mw.name.startsWith('disable') && mw.fn({ date }).data?.isDisabled) {
			return true;
		}
	}

	return false;
}

//-----------------------------------------------
//  Array helpers
//-----------------------------------------------

/**
 * Creates a 2D grid (matrix) of specified dimensions and fills it using a builder function.
 *
 * @template T - The type of values stored in the grid.
 * @param {number} rows - The number of rows in the grid.
 * @param {number} cols - The number of columns in the grid.
 * @param {(row: number, col: number) => T} builder - A function that returns the value to place at each cell
 *                                                    based on its row and column index.
 * @returns {Grid<T>} A 2D array (grid) filled with values generated by the builder function.
 *
 * @example
 * const grid = createGrid(2, 3, (row, col) => `${row},${col}`);
 * // Result:
 * // [
 * //   ['0,0', '0,1', '0,2'],
 * //   ['1,0', '1,1', '1,2']
 * // ]
 */
export function createGrid<T>(
	rows: number,
	cols: number,
	builder: (row: number, col: number) => T
): Grid<T> {
	return Array.from({ length: rows }, (_, i) => {
		return Array.from({ length: cols }, (_, j) => builder(i, j));
	});
}

//-----------------------------------------------
//  Object helpers
//-----------------------------------------------

/**
 * Checks if a given value is a plain object (`{}`), excluding arrays, null,
 * class instances, and objects with a custom prototype.
 *
 * A plain object is defined as an object created using:
 * - Object literal: `{}` or `new Object()`
 * - Has `Object.prototype` as its direct prototype
 *
 * @param value - The value to check.
 * @returns `true` if the input is a plain object, otherwise `false`.
 *
 * @example
 * isPlainObject({}); // true
 * isPlainObject({ a: 1 }); // true
 * isPlainObject([]); // false
 * isPlainObject(null); // false
 * isPlainObject(new Date()); // false
 * isPlainObject(Object.create(null)); // false
 */
export function isPlainObject(value: unknown): value is Record<string | number | symbol, unknown> {
	return !!value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
}

//-----------------------------------------------
//  Numeric helpers
//-----------------------------------------------

/**
 * Checks if the given value is a valid finite number.
 *
 * This function verifies that:
 * 1. The value is a number primitive (not a string, boolean, etc.)
 * 2. It is a finite number (not NaN, Infinity, or -Infinity)
 *
 * @param value The value to be checked.
 * @returns `true` if the value is a finite number, otherwise `false`.
 *
 * @example
 * isNumber(1.2);         // true
 * isNumber(1);           // true
 * isNumber('1');         // false
 * isNumber(Infinity);    // false
 * isNumber(-Infinity);   // false
 * isNumber(NaN);         // false
 * isNumber(null);        // false
 * isNumber(undefined);   // false
 */
function isNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Clamps a given number between a minimum and a maximum value.
 *
 * If the input `value` is less than `min`, the function returns `min`.
 * If the input `value` is greater than `max`, it returns `max`.
 * Otherwise, it returns the `value` itself.
 *
 * @param value - The number to clamp.
 * @param min - The lower bound of the clamping range.
 * @param max - The upper bound of the clamping range.
 * @returns The clamped number within the specified range.
 *
 * @example
 * clamp(5, 1, 10); // returns 5
 * clamp(-3, 0, 8); // returns 0
 * clamp(15, 0, 8); // returns 8
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

/**
 * Checks if the given value is a valid integer.
 *
 * This function verifies two conditions:
 * 1. The value is a number primitive (not a string, boolean, etc.)
 * 2. It is an integer (not a float, NaN, or Infinity)
 *
 * @param value The value to be checked.
 * @returns `true` if the value is a finite integer number, otherwise `false`.
 *
 * @example
 * isInteger(1);        // true
 * isInteger(0);        // true
 * isInteger(1.2);      // false
 * isInteger('1');      // false
 * isInteger(NaN);      // false
 * isInteger(Infinity); // false
 */
export function isInteger(value: unknown): value is number {
	return isNumber(value) && Number.isInteger(value);
}
