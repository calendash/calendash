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
 * Extension of the built-in `ErrorConstructor` to include the optional Node.js-specific
 * `captureStackTrace` method.
 */
export interface NodeErrorConstructor extends ErrorConstructor {
	captureStackTrace?(targetObject: object, constructorOpt?: Function): void;
}

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

export interface BaseCell {
	/**
	 * The timestamp in milliseconds since the Unix epoch (`Date.getTime()`).
	 * Used as a unique identifier for the cell.
	 */
	timestamp: number;

	/**
	 * The day of the month (1–31).
	 */
	dayOfMonth: number;

	/**
	 * The day of the week (0–6), where 0 = Sunday and 6 = Saturday.
	 */
	weekday: number;

	/**
	 * The zero-based month index (0 = January, 11 = December).
	 */
	monthIndex: number;

	/**
	 * The full year (e.g., 2025).
	 */
	year: number;

	/**
	 * Indicates whether this cell represents today's date.
	 */
	isCurrentDay: boolean;

	/**
	 * Indicates whether this cell falls outside the current visible calendar view.
	 * For example, a day in a previous or next month rendered in a monthly view grid.
	 */
	isOutsideView: boolean;

	/**
	 * Whether the cell is currently selected.
	 */
	isSelected: boolean;

	/**
	 * Whether the cell is disabled due to bounds or custom middleware logic.
	 */
	isDisabled: boolean;
}

/**
 * Base structure for a day cell.
 */
export type DayCell = Omit<BaseCell, 'isCurrentDay' | 'isOutsideView'>;

/**
 * Represents a single day within a week view
 */
export type WeekCell = BaseCell;

/**
 * Represents a single day within a month view
 */
export type MonthCell = BaseCell & {
	isCurrentWeek: boolean;
};

/**
 * Represents a single month within a year view.
 */
export type YearCell = Omit<
	BaseCell,
	'dayOfMonth' | 'weekday' | 'isCurrentDay' | 'isOutsideView'
> & {
	isCurrentMonth: boolean;
};

/**
 * Represents a single year within a decade view.
 */
export type DecadeCell = Omit<
	BaseCell,
	'dayOfMonth' | 'weekday' | 'monthIndex' | 'isCurrentDay'
> & {
	isCurrentYear: boolean;
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

	/** Disable date middleware function applied during the build process. */
	disableMiddleware?: Middleware;
};
