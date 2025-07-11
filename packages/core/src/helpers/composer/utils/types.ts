import type { DateBounds, Middleware } from '../../../common';

export type Grid<T> = T[][];
export type BuilderContext = {
	target: Date;
	today: Date;
	bounds: DateBounds;
	middlewares: Middleware[];
};
