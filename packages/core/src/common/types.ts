import type {
	BOUNDS,
	DATE_NAVIGATION_MODE,
	DIRECTION_NEXT,
	DIRECTION_PREV,
	VIEW_NAVIGATION_MODE,
	VIEWS,
} from './constants';
import type { Day, Decade, Month, Week, Year } from '../helpers/composer/builders';

export type ViewType = (typeof VIEWS)[number];
export type DateType = string | number | Date;
export type Direction = typeof DIRECTION_PREV | typeof DIRECTION_NEXT;
export type Bound = (typeof BOUNDS)[number];
export type DateBoundsRaw = Record<Bound, DateType>;
export type DateBounds = Record<Bound, Date>;
export type ViewOffsets = {
	[V in ViewType as `${V}s`]: number;
};
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
export type ViewData = {
	day: Day;
	week: Week;
	month: Month;
	year: Year;
	decade: Decade;
};
export type NavigationMode = typeof DATE_NAVIGATION_MODE | typeof VIEW_NAVIGATION_MODE;
