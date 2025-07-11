import type { Bound, Direction, NavigationMode, ViewType } from './types';

export const VIEWS: readonly ViewType[] = ['day', 'week', 'month', 'year', 'decade'] as const;
export const BOUNDS: readonly Bound[] = ['min', 'max'] as const;
export const DIRECTION_NEXT: Direction = 1 as const;
export const DIRECTION_PREV: Direction = -1 as const;
export const DIRECTION_NAME: Record<Direction, string> = {
	[DIRECTION_PREV]: 'backward',
	[DIRECTION_NEXT]: 'forward',
} as const;
export const DATE_BOUNDARIES: Record<Bound, string> = {
	max: '2999-12-31T23:59:59.999Z',
	min: '1900-01-01T00:01:01.001Z',
} as const;
export const MAX_CACHE_SIZE: number = 50 as const;
export const DATE_FORMAT_OPTS: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	hour12: false,
} as const;
export const DATE_NAVIGATION_MODE: NavigationMode = 'date' as const;
export const VIEW_NAVIGATION_MODE: NavigationMode = 'view' as const;
export const ISO_DATE_REGEX: RegExp = /^\d{4}-\d{2}-\d{2}$/;
