/**
 * @private
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
