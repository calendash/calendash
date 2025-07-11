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
