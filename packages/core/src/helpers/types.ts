import type {
	DateBounds,
	Grid,
	ViewType,
	DeepPartial,
	DateBoundsRaw,
	Direction,
	ViewOffsets,
	DateType,
	Bound,
} from '../utils/types';
import type { Middleware, MiddlewareReturn, MiddlewareState } from '../middlewares/types';
import type {
	Day,
	DayCell,
	Week,
	WeekCell,
	Month,
	MonthCell,
	Year,
	YearCell,
	Decade,
	DecadeCell,
} from './composer/builders';

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
export type {
	Grid,
	Bound,
	DateBounds,
	ViewType,
	DeepPartial,
	DateBoundsRaw,
	Direction,
	ViewOffsets,
	DateType,
	Middleware,
	MiddlewareReturn,
	MiddlewareState,
	Day,
	DayCell,
	Week,
	WeekCell,
	Month,
	MonthCell,
	Year,
	YearCell,
	Decade,
	DecadeCell,
};
