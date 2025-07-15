import type {
	DateBoundsRaw,
	DateType,
	DeepPartial,
	Direction,
	Middleware,
	NavigationMode,
	ViewData,
	ViewType,
} from './types';
import { Composer } from './modules/composer';
import { Layout } from './modules/layout';
import { Moment } from './modules/moment';
import { DATE_NAVIGATION_MODE, VIEW_NAVIGATION_MODE } from './utils/constants';

export type CalendarConfig = {
	/**
	 * The reference date for the calendar (e.g., today or a selected date).
	 */
	date: DateType;

	/**
	 * The allowed date bounds (minimum and maximum).
	 * This restricts navigation and selection to within this range.
	 */
	bounds: DateBoundsRaw;

	/**
	 * The initial active view of the calendar (e.g., 'day', 'week', 'month').
	 */
	view: ViewType;

	/**
	 * Time zone used for rendering dates.
	 * Example: 'America/New_York', 'UTC'.
	 */
	timeZone: string;

	/**
	 * Views that should be skipped or hidden from navigation.
	 */
	skipViews: ViewType[];

	/**
	 * Middleware functions to manipulate returned calendar view data.
	 */
	middlewares: Middleware[];
};

/**
 * Primary Calendar class handling date navigation,
 * view transitions, and middleware-based data transformation.
 */
export class Calendar {
	readonly #moment: Moment;
	readonly #layout: Layout;
	readonly #composer: Composer;

	/**
	 * Retrieves the current active calendar view.
	 * This represents the current layout view mode of the calendar,
	 * such as `'day'`, `'week'`, `'month'`, `'year'` or `'decade'`.
	 *
	 * @returns {ViewType} The current view type of the calendar.
	 *
	 * @example
	 * calendar.view; // "month"
	 */
	get view(): ViewType {
		return this.#layout.view;
	}

	/**
	 * Retrieves the current active calendar date.
	 * This represents the current target date of the calendar.
	 *
	 * @returns {Date} The current target date of the calendar.
	 *
	 * @example
	 * calendar.date; // Date object
	 */
	get target(): Date {
		return this.#moment.date;
	}

	/**
	 * Returns calendar data based on the current view and moment date.
	 *
	 * @returns Generated calendar data.
	 */
	get data(): ViewData[ViewType] {
		return this.#composer.data(this.#layout.view, this.#moment.date);
	}

	/**
	 * Determines if next date is visible based on current calendar view.
	 *
	 * @returns True if next date exists, otherwise false.
	 */
	get hasNextDate(): boolean {
		return this.#moment.isAdjacentDateVisible(`${this.#layout.view}s`, 1);
	}

	/**
	 * Determines if previous date is visible based on current calendar view.
	 *
	 * @returns True if previous date exists, otherwise false.
	 */
	get hasPrevDate(): boolean {
		return this.#moment.isAdjacentDateVisible(`${this.#layout.view}s`, -1);
	}

	/**
	 * Determines if next ascending view is visible.
	 *
	 * @returns True if previous view exists, otherwise false.
	 */
	get hasNextView(): boolean {
		return !!this.#layout.getAdjacentView(1);
	}

	/**
	 * Determines if next descending view is visible.
	 *
	 * @returns True if previous view exists, otherwise false.
	 */
	get hasPrevView(): boolean {
		return !!this.#layout.getAdjacentView(-1);
	}

	constructor(config?: DeepPartial<CalendarConfig>) {
		const { date, bounds, skipViews, timeZone, view, middlewares } = config ?? {};
		this.#moment = new Moment({ bounds, targetDate: date });
		this.#layout = new Layout({ viewTarget: view, skipViews });
		this.#composer = new Composer({ bounds, timeZone, middlewares });

		if (timeZone) {
			this.#moment.toZonedDateTime(timeZone);
		}
	}

	/**
	 * Updates the calendar's internal state to match the provided target date,
	 * without modifying the current view or time (hours, minutes, etc.).
	 *
	 * @param date The date to navigate to. Must be a valid `Date` or compatible date-like object.
	 * @returns The current instance of the Calendar for method chaining.
	 */
	jumpToDate(date: DateType): Calendar {
		this.#moment.from(date);
		return this;
	}

	/**
	 * Navigates the calendar based on the specified mode and direction.
	 *
	 * - `'date'` mode shifts the current date forward or backward.
	 * - `'view'` mode transitions between different calendar views (e.g., day, month, year).
	 *
	 * @param mode - The navigation mode, either `'date'` or `'view'`.
	 * @param direction - A numeric value representing the navigation direction:
	 *                    `1` to move forward, `-1` to move backward.
	 * @returns The current instance of the Calendar for method chaining.
	 *
	 * @throws {Error} If an unsupported navigation mode or invalid direction is provided.
	 */
	navigate(mode: NavigationMode, direction: Direction): Calendar {
		switch (mode) {
			case DATE_NAVIGATION_MODE:
				this.#moment.add({ [`${this.#layout.view}s`]: direction });
				break;
			case VIEW_NAVIGATION_MODE:
				this.#layout.shift(direction);
				break;
			default:
				throw new Error('Invalid navigation mode.');
		}
		return this;
	}
}
