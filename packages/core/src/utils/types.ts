export type * from '../middlewares/types';
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
