import type {
	BuilderContext,
	DateBounds,
	DateBoundsRaw,
	DeepPartial,
	Middleware,
	ViewData,
	ViewType,
} from '../../types';
import { adjustDateTimeZone, DATE_BOUNDARIES, isPlainObject, isDate, toDate } from '../../utils';
import { day, month, week, year, decade } from './builders';

type ComposerCache<V extends ViewType> = {
	data?: ViewData[V];
	view: V;
	time: number;
};

type BuilderHandler<V extends ViewType> = (ctx: BuilderContext) => ViewData[V];

type DataBuilders = {
	[V in ViewType]: BuilderHandler<V>;
};

const dataBuilders: DataBuilders = {
	day,
	week,
	month,
	year,
	decade,
} as const;

export type ComposerConfig = {
	timeZone?: string;
	bounds?: DeepPartial<DateBoundsRaw>;
	middlewares?: Middleware[];
};

/**
 * The Composer class is responsible for generating calendar view data
 * (e.g. day, week, month, year, decade) using appropriate builder strategies.
 * It supports middleware application and internal caching to avoid redundant builds.
 */
export class Composer {
	#cache: ComposerCache<ViewType> | null = null;
	readonly #today: Date;
	readonly #bounds: DateBounds;
	readonly #middlewares: Middleware[];

	/**
	 * Creates a new Composer instance.
	 *
	 * @param timeZone - Optional time zone string to normalize date inputs.
	 * @param rawBounds - Optional object to define `min` and `max` date limits.
	 * @param middlewares - Optional array of middleware functions to enhance or modify the context.
	 */
	constructor(config?: ComposerConfig) {
		const { timeZone, bounds, middlewares = [] } = config ?? {};
		this.#today = !!timeZone ? adjustDateTimeZone(new Date(), timeZone) : new Date();
		const max = toDate(bounds?.max ?? DATE_BOUNDARIES.max);
		const min = toDate(bounds?.min ?? DATE_BOUNDARIES.min);
		this.#bounds = {
			max: !!timeZone ? adjustDateTimeZone(max, timeZone) : max,
			min: !!timeZone ? adjustDateTimeZone(min, timeZone) : min,
		};
		this.#middlewares = !!middlewares
			? middlewares.filter((middleware): middleware is Middleware => isPlainObject(middleware))
			: [];
	}

	/**
	 * Generates view data for a specific calendar view and target date.
	 * Uses caching to avoid rebuilding if input hasn't changed.
	 *
	 * @typeParam V - A valid view type (e.g., 'day', 'week', etc.)
	 * @param view - The calendar view type to build.
	 * @param target - The target date for which to generate view data.
	 * @returns The generated view data for the given view and date.
	 * @throws Will throw an error if the target date is invalid or if the builder strategy is missing.
	 */
	data<V extends ViewType>(view: V, target: Date): ViewData[V] {
		if (!isDate(target)) {
			// TODO: Create dedicated exception
			throw new Error('Invalid target date.');
		}

		const isValidCache =
			isPlainObject(this.#cache) &&
			isPlainObject(this.#cache.data) &&
			this.#cache.view === view &&
			this.#cache.time === target.getTime();

		if (!isValidCache) {
			const fn = dataBuilders[view];
			if (typeof fn !== 'function') {
				// TODO: Create dedicated exception
				throw new Error('Invalid builder strategy handler.');
			}

			this.#cache = {
				view,
				time: target.getTime(),
				data: fn({
					target,
					today: this.#today,
					bounds: this.#bounds,
					middlewares: this.#middlewares,
				}),
			};
		}

		return (this.#cache as ComposerCache<V>).data!;
	}
}
