import {
	adjustDateTimeZone,
	DATE_BOUNDARIES,
	toDate,
	isDate,
	isPlainObject,
	type DateBoundsRaw,
	type DateBounds,
	type ViewData,
	type ViewType,
	type DeepPartial,
	type Middleware,
} from '../../common';
import { type BuilderContext } from './utils';
import { day, week, month, year, decade } from './builders';

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

export class Composer {
	#cache: ComposerCache<ViewType> | null = null;
	readonly #today: Date;
	readonly #bounds: DateBounds;
	readonly #middlewares: Middleware[];

	constructor(
		rawBounds?: DeepPartial<DateBoundsRaw>,
		timeZone?: string,
		middlewares: Middleware[] = []
	) {
		this.#today = !!timeZone ? adjustDateTimeZone(new Date(), timeZone) : new Date();
		const max = toDate(rawBounds?.max ?? DATE_BOUNDARIES.max);
		const min = toDate(rawBounds?.min ?? DATE_BOUNDARIES.min);
		this.#bounds = {
			max: !!timeZone ? adjustDateTimeZone(max, timeZone) : max,
			min: !!timeZone ? adjustDateTimeZone(min, timeZone) : min,
		};
		this.#middlewares = middlewares.filter((middleware): middleware is Middleware =>
			isPlainObject(middleware)
		);
	}

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
