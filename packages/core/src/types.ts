export type Grid<T> = T[][];
export type ViewType = 'day' | 'week' | 'month' | 'year' | 'decade';
export type Direction = -1 | 1;
export type Bound = 'min' | 'max';
export type DateBounds = Record<Bound, Date>;
export type DateBoundsRaw = Record<Bound, DateType>;
export type DateType = string | number | Date;
export type ViewOffsets = {
	[V in ViewType as `${V}s`]: number;
};
export type NavigationMode = 'date' | 'view';
export type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends object
		? T[K] extends readonly unknown[]
			? T[K]
			: DeepPartial<T[K]>
		: T[K];
};
export type MiddlewareState = {
	date: Date;
};
export type MiddlewareReturn = {
	data?: {
		[key: string]: unknown;
	};
};
export type Middleware = {
	name: string;
	options?: unknown;
	fn: (state: MiddlewareState) => MiddlewareReturn;
};
export type DayCell = {
	time: number;
	day: number;
	dayOfWeek: number;
	month: number;
	year: number;
	isSelected: boolean;
	isDisabled: boolean;
};
export type WeekCell = DayCell & {
	isCurrentDay: boolean;
	isOutOfRange: boolean;
};
export type MonthCell = WeekCell & {
	isCurrentWeek: boolean;
};
export type YearCell = {
	time: number;
	month: number;
	year: number;
	isCurrentMonth: boolean;
	isOutOfRange: boolean;
	isSelected: boolean;
	isDisabled: boolean;
};
export type DecadeCell = {
	time: number;
	year: number;
	isCurrentYear: boolean;
	isOutOfRange: boolean;
	isSelected: boolean;
	isDisabled: boolean;
};
export type Day = {
	isCurrentDay: boolean;
	cells: Grid<DayCell>;
};
export type Week = {
	isCurrentWeek: boolean;
	cells: Grid<WeekCell>;
};
export type Month = {
	isCurrentMonth: boolean;
	cells: Grid<MonthCell>;
};
export type Year = {
	isCurrentYear: boolean;
	cells: Grid<YearCell>;
};
export type Decade = {
	isCurrentDecade: boolean;
	cells: Grid<DecadeCell>;
};
export type ViewData = {
	day: Day;
	week: Week;
	month: Month;
	year: Year;
	decade: Decade;
};
export type BuilderContext = {
	target: Date;
	today: Date;
	bounds: DateBounds;
	middlewares: Middleware[];
};
