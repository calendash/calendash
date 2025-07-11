import type { ViewType } from '../../types';
import { DIRECTION_NEXT, DIRECTION_PREV } from '../../utils/constants';
import { clamp, isInteger } from '../../utils/numeric';

/**
 * Returns the adjacent view in a given direction within a list of views.
 *
 * This function determines the next or previous view relative to a given current view,
 * based on the provided direction. It safely clamps the direction to either -1 (previous)
 * or 1 (next) and returns the corresponding view from the list.
 *
 * @param direction - The navigation direction. Should be either -1 (previous) or 1 (next).
 * @param view - The current active view from which navigation begins.
 * @param views - An ordered list of available views.
 *
 * @returns The adjacent view in the specified direction, or `undefined` if out of bounds.
 *
 * @throws {Error} If `direction` is not an integer.
 * @throws {Error} If `views` is not a valid array.
 *
 * @example
 * const views = ['day', 'week', 'month', 'year', 'decade'] as const;
 * getAdjacentView(1, 'month', views); // returns 'year'
 * getAdjacentView(-1, 'week', views); // returns 'day'
 */
export function getAdjacentView<V extends ViewType>(
	direction: number,
	view: V,
	views: readonly V[]
): V | undefined {
	if (!isInteger(direction)) {
		// TODO: Create dedicated exception
		throw new Error('Invalid direction: expected an integer value of -1 or 1.');
	}

	const step = clamp(direction, DIRECTION_PREV, DIRECTION_NEXT);
	const currentIndex = views.indexOf(view);
	return views[currentIndex + step];
}
