import type {
	BuilderContext,
	DateBounds,
	DateBoundsRaw,
	DeepPartial,
	Middleware,
	ViewData,
	ViewType,
} from '../../../../types';
import { DATE_BOUNDARIES } from '../../../../utils/constants';
import { adjustDateTimeZone, isPlainObject, isDate, toDate } from '../../../../utils/helpers';
import { day, month, week, year, decade } from './internal';
import { ComposerError, ComposerErrorCode } from './composer.error';

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
	/**
	 * Optional IANA time zone string (e.g., "America/New_York").
	 * If provided, all internal date calculations will be normalized to this time zone.
	 */
	timeZone?: string;

	/**
	 * Optional partial object defining minimum and/or maximum date limits.
	 * These bounds are used to validate whether dates are within the allowed range.
	 */
	bounds?: DeepPartial<DateBoundsRaw>;

	/**
	 * Optional array of middleware functions that can modify the generated view data.
	 * Middleware is executed during the build process for each cell.
	 */
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
	 * @param config - Optional configuration object to control time zone, bounds, and middleware.
	 *   - `timeZone`: Normalizes all internal date values to the provided time zone.
	 *   - `bounds`: Optional date boundaries to constrain calendar data generation.
	 *   - `middlewares`: Optional array of functions to intercept and modify cell metadata.
	 */
	constructor(config?: ComposerConfig) {
		const { timeZone, bounds, middlewares = [] } = config ?? {};

		try {
			const max = toDate(bounds?.max ?? DATE_BOUNDARIES.max);
			const min = toDate(bounds?.min ?? DATE_BOUNDARIES.min);
			this.#today = timeZone ? adjustDateTimeZone(new Date(), timeZone) : new Date();
			this.#bounds = {
				max: timeZone ? adjustDateTimeZone(max, timeZone) : max,
				min: timeZone ? adjustDateTimeZone(min, timeZone) : min,
			};
		} catch (error) {
			throw new ComposerError(
				ComposerErrorCode.INVALID_DATE,
				`Invalid date or timezone provided: ${error instanceof Error ? error.message : String(error)}`
			);
		}
		this.#middlewares = middlewares.filter((mdw): mdw is Middleware => isPlainObject(mdw));
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
			throw new ComposerError(
				ComposerErrorCode.INVALID_DATE,
				'Target date must be a valid Date object'
			);
		}

		const isValidCache =
			isPlainObject(this.#cache) &&
			isPlainObject(this.#cache.data) &&
			this.#cache.view === view &&
			this.#cache.time === target.getTime();

		if (!isValidCache) {
			const fn = dataBuilders[view];
			if (typeof fn !== 'function') {
				throw new ComposerError(
					ComposerErrorCode.INVALID_VIEW,
					`Unknown view type "${view}". Expected one of: ${Object.keys(dataBuilders).join(', ')}.`
				);
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
