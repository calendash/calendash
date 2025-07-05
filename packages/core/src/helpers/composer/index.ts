import {
	adjustDateTimeZone,
	DATE_BOUNDARIES,
	toDate,
	isDate,
	type DateBoundsRaw,
	type DateBounds,
	type ViewData,
	type ViewType,
	type DeepPartial,
} from '../../utils';
import { dataBuilders } from './dataBuilders';

type ComposerCache<V extends ViewType> = {
	data?: ViewData[V];
	view: V;
	time: number;
};

export class Composer {
	#cache: ComposerCache<ViewType> | null = null;
	readonly #today: Date;
	readonly #bounds: DateBounds;

	constructor(rawBounds?: DeepPartial<DateBoundsRaw>, timeZone?: string) {
		this.#today = !!timeZone ? adjustDateTimeZone(new Date(), timeZone) : new Date();
		const max = toDate(rawBounds?.max ?? DATE_BOUNDARIES.max);
		const min = toDate(rawBounds?.min ?? DATE_BOUNDARIES.min);
		this.#bounds = {
			max: !!timeZone ? adjustDateTimeZone(max, timeZone) : max,
			min: !!timeZone ? adjustDateTimeZone(min, timeZone) : min,
		};
	}

	data<V extends ViewType>(view: V, target: Date): ViewData[V] {
		if (!isDate(target)) {
			// TODO: Create dedicated exception
			throw new Error('Invalid target date.');
		}

		const isValidCache =
			!!this.#cache &&
			!!this.#cache.data &&
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
				data: fn({ target, today: this.#today, bounds: this.#bounds }),
			};
		}

		return (this.#cache as ComposerCache<V>).data!;
	}
}
