import type { ViewType } from '../../../../../types';
import { VIEWS } from '../../../../../utils/constants';

/**
 * Returns the list of visible views, excluding any specified in the `skipViews` array.
 *
 * @param skipViews - An array of views to exclude from the result.
 * @returns An array of visible views.
 */
export function getVisibleViews(skipViews: ViewType[]): readonly ViewType[] {
	if (skipViews.length === 0) return VIEWS;
	const skipSet = new Set(skipViews);
	return VIEWS.filter((view) => !skipSet.has(view));
}
