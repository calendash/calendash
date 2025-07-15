/**
 * A 2D matrix structure used to represent view data (e.g., calendar cells).
 */
export type Grid<T> = T[][];

/**
 * Represents a calendar view type.
 */
export type ViewType = 'day' | 'week' | 'month' | 'year' | 'decade';

/**
 * Direction used in calendar navigation.
 */
export type Direction = -1 | 1;

/**
 * Boundary keys for defining date limits.
 */
export type Bound = 'min' | 'max';

/**
 * A raw date boundary object using flexible date input types.
 */
export type DateBoundsRaw = Record<Bound, DateType>;

/**
 * A normalized date boundary object with concrete `Date` values.
 */
export type DateBounds = Record<Bound, Date>;

/**
 * Generic date input accepted throughout the system.
 * Can be a string (ISO), timestamp, or `Date` instance.
 */
export type DateType = string | number | Date;

/**
 * Offset definitions used for navigating between date units.
 * @example
 * `{ days: 1, weeks: 1, months: 1 }`
 */
export type ViewOffsets = {
	[V in ViewType as `${V}s`]: number;
};

/**
 * Type of navigation allowed in the calendar.
 *
 * - `'date'`: Moves the current date forward or backward.
 * - `'view'`: Changes the current view (e.g., from 'month' to 'year').
 */
export type NavigationMode = 'date' | 'view';

/**
 * Recursively marks properties of a type as optional.
 */
export type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends object
		? T[K] extends readonly unknown[]
			? T[K]
			: DeepPartial<T[K]>
		: T[K];
};

/**
 * Input state provided to middleware functions.
 */
export type MiddlewareState = {
	date: Date;
};

/**
 * Return structure from a middleware function.
 * Middleware can optionally return custom metadata.
 */
export type MiddlewareReturn = {
	data?: {
		[key: string]: unknown;
	};
};

/**
 * Defines a middleware function used to enhance or modify calendar data.
 */
export type Middleware = {
	/** A unique name for the middleware */
	name: string;

	/** Optional user-defined options */
	options?: unknown;

	/** Middleware execution function */
	fn: (state: MiddlewareState) => MiddlewareReturn;
};

/**
 * Base structure for a day cell.
 */
export type DayCell = {
	time: number;
	day: number;
	dayOfWeek: number;
	month: number;
	year: number;
	isSelected: boolean;
	isDisabled: boolean;
};

/**
 * Week cell extends DayCell with contextual flags.
 */
export type WeekCell = DayCell & {
	isCurrentDay: boolean;
	isOutOfRange: boolean;
};

/**
 * Month cell extends WeekCell with additional flags.
 */
export type MonthCell = WeekCell & {
	isCurrentWeek: boolean;
};

/**
 * Represents a single month within a year view.
 */
export type YearCell = {
	time: number;
	month: number;
	year: number;
	isCurrentMonth: boolean;
	isOutOfRange: boolean;
	isSelected: boolean;
	isDisabled: boolean;
};

/**
 * Represents a single year within a decade view.
 */
export type DecadeCell = {
	time: number;
	year: number;
	isCurrentYear: boolean;
	isOutOfRange: boolean;
	isSelected: boolean;
	isDisabled: boolean;
};

/**
 * Calendar data structure for the "day" view.
 */
export type Day = {
	isCurrentDay: boolean;
	cells: Grid<DayCell>;
};

/**
 * Calendar data structure for the "week" view.
 */
export type Week = {
	isCurrentWeek: boolean;
	cells: Grid<WeekCell>;
};

/**
 * Calendar data structure for the "month" view.
 */
export type Month = {
	isCurrentMonth: boolean;
	cells: Grid<MonthCell>;
};

/**
 * Calendar data structure for the "year" view.
 */
export type Year = {
	isCurrentYear: boolean;
	cells: Grid<YearCell>;
};

/**
 * Calendar data structure for the "decade" view.
 */
export type Decade = {
	isCurrentDecade: boolean;
	cells: Grid<DecadeCell>;
};

/**
 * Unified structure for all calendar views.
 */
export type ViewData = {
	day: Day;
	week: Week;
	month: Month;
	year: Year;
	decade: Decade;
};

/**
 * Shared context passed to all view builders.
 */
export type BuilderContext = {
	/** The reference date used to build the view. */
	target: Date;

	/** Today's date, pre-computed with optional timezone applied. */
	today: Date;

	/** Allowed date boundaries used to disable or restrict cells. */
	bounds: DateBounds;

	/** Middleware functions applied during the build process. */
	middlewares: Middleware[];
};
