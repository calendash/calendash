import {
	clamp,
	DIRECTION_NAME,
	DIRECTION_NEXT,
	DIRECTION_PREV,
	isInteger,
	VIEWS,
	type Direction,
	type ViewType,
} from '../utils';

/**
 * Returns the list of visible views, excluding any specified in the `skipViews` array.
 *
 * @param skipViews - An array of views to exclude from the result.
 * @returns An array of visible views.
 */
function getVisibleViews(skipViews: ViewType[]): readonly ViewType[] {
	if (skipViews.length === 0) return VIEWS;
	const skipSet = new Set(skipViews);
	return VIEWS.filter((view) => !skipSet.has(view));
}

export class Layout {
	#view: ViewType;
	readonly #visibleViews: readonly ViewType[];

	get view() {
		return this.#view;
	}

	constructor(viewTarget: ViewType = VIEWS[0], skipViews?: ViewType[]) {
		const views = getVisibleViews(skipViews ?? []);

		if (views.length === 0) {
			// TODO: Create dedicated exception
			throw new Error('Invalid skipViews: excluding all views is not allowed');
		}

		this.#view = views.find((view) => view === viewTarget) ?? views[0];
		this.#visibleViews = views;
	}

	/**
	 * Returns the adjacent visible view based on the given direction.
	 *
	 * This method attempts to resolve the next or previous view relative to
	 * the current one, using the specified direction (`-1` for previous, `1` for next).
	 * If the direction is invalid or no adjacent view exists, it returns `undefined`.
	 *
	 * @param direction - The navigation direction: `-1` for previous, `1` for next.
	 * @returns The adjacent `ViewType` if it exists; otherwise, `undefined`.
	 *
	 * @throws Error If the provided direction is not a valid integer (-1 or 1).
	 *
	 * @example
	 * const next = layout.getAdjacentView(1);   // Gets the next visible view
	 * const prev = layout.getAdjacentView(-1);  // Gets the previous visible view
	 */
	getAdjacentView(direction: number): ViewType | undefined {
		if (!isInteger(direction)) {
			// TODO: Create dedicated exception
			throw new Error('Invalid direction: expected an integer value of -1 or 1.');
		}
		const step = clamp(direction, DIRECTION_PREV, DIRECTION_NEXT);
		const currentIndex = this.#visibleViews.indexOf(this.#view);
		return this.#visibleViews[currentIndex + step];
	}

	/**
	 * Attempts to shift the current view in the specified direction.
	 *
	 * This method tries to move the current view to the adjacent visible view
	 * based on the given `direction` (`-1` for backward, `1` for forward).
	 * If no adjacent view exists in that direction, the current view remains unchanged.
	 *
	 * @param direction - The direction to shift the view: `-1` for backward, `1` for forward.
	 * @returns The current instance of `Layout`, allowing method chaining.
	 *
	 * @example
	 * ```ts
	 * layout.shift(1);  // Attempts to move to the next view.
	 * layout.shift(-1); // Attempts to move to the previous view.
	 * ```
	 */
	shift(direction: Direction): Layout {
		const adjacentView = this.getAdjacentView(direction);

		if (adjacentView) {
			this.#view = adjacentView;
			return this;
		}

		if (__DEV__) {
			const isSingleView = this.#visibleViews.length === 1;
			const reason = isSingleView
				? 'Only one view is available; cannot shift.'
				: `No view exists in the ${DIRECTION_NAME[direction]} direction.`;
			console.warn('[Layout] View shift failed:', reason, {
				currentView: this.#view,
				direction,
				visibleViews: this.#visibleViews,
			});
		}

		return this;
	}
}
