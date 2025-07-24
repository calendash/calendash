import type {
	DateBoundsRaw,
	DateType,
	DeepPartial,
	Direction,
	Middleware,
	NavigationMode,
	ViewData,
	ViewType,
} from '../../types';
import { DATE_NAVIGATION_MODE, VIEW_NAVIGATION_MODE } from '../../utils/constants';
import { Composer, Layout, Moment } from './modules';
import { CalendarError, CalendarErrorCode } from './calendar.error';

export type CalendarConfig = {
	/**
	 * The initial reference date for the calendar.
	 * Can be a `Date`, timestamp, or ISO string. Defaults to the current date if not provided.
	 *
	 * This date serves as the base for rendering and view generation (e.g., the "selected" date).
	 */
	date?: DateType;

	/**
	 * Optional date boundaries to constrain navigation and selection.
	 * Only dates within the `min` and `max` bounds will be considered valid.
	 */
	bounds?: DeepPartial<DateBoundsRaw>;

	/**
	 * The initial active view for the calendar, such as `'day'`, `'week'`, `'month'`, etc.
	 * If not specified, the first available view will be used.
	 */
	view?: ViewType;

	/**
	 * Optional IANA time zone identifier (e.g., `'America/New_York'`, `'UTC'`).
	 * When provided, all date computations will be normalized to this time zone.
	 */
	timeZone?: string;

	/**
	 * A list of views to exclude from the calendar.
	 * These views will not be rendered or navigable by the user.
	 *
	 * @example
	 * skipViews: ['decade', 'year'] // Hide long-range views
	 */
	skipViews?: ViewType[];

	/**
	 * Optional middleware functions that are applied during view data generation.
	 * These can be used to inject metadata or customize how individual cells behave.
	 */
	middlewares?: Middleware[];
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
	 * @returns {boolean} True if previous view exists, otherwise false.
	 */
	get hasNextView(): boolean {
		return !!this.#layout.getAdjacentView(1);
	}

	/**
	 * Determines if next descending view is visible.
	 *
	 * @returns {boolean} True if previous view exists, otherwise false.
	 */
	get hasPrevView(): boolean {
		return !!this.#layout.getAdjacentView(-1);
	}

	constructor(config?: CalendarConfig) {
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
	 * @returns {Calendar} The current instance of the Calendar for method chaining.
	 */
	jumpToDate(date: DateType): this {
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
	 * @returns {Calendar} The current instance of the Calendar for method chaining.
	 *
	 * @throws {CalendarError} If an unsupported navigation mode or invalid direction is provided.
	 */
	navigate(mode: NavigationMode, direction: Direction): this {
		switch (mode) {
			case DATE_NAVIGATION_MODE:
				this.#moment.add({ [`${this.#layout.view}s`]: direction });
				break;
			case VIEW_NAVIGATION_MODE:
				this.#layout.shift(direction);
				break;
			default:
				throw new CalendarError(
					CalendarErrorCode.INVALID_NAV_MODE,
					`Unsupported navigation mode. Expected one of: ${DATE_NAVIGATION_MODE}, ${VIEW_NAVIGATION_MODE}.`
				);
		}
		return this;
	}
}
