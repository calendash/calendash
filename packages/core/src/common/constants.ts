export const VIEWS = ['day', 'week', 'month', 'year', 'decade'] as const;
export const BOUNDS = ['min', 'max'] as const;
export const DIRECTION_NEXT = 1 as const;
export const DIRECTION_PREV = -1 as const;
export const DIRECTION_NAME = {
	[DIRECTION_PREV]: 'backward',
	[DIRECTION_NEXT]: 'forward',
} as const;
export const DATE_BOUNDARIES = {
	max: '2999-12-31T23:59:59.999Z',
	min: '1900-01-01T00:01:01.001Z',
} as const;
export const MAX_CACHE_SIZE = 50 as const;
export const DATE_FORMAT_OPTS = {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	hour12: false,
} as const;
export const DATE_NAVIGATION_MODE = 'date' as const;
export const VIEW_NAVIGATION_MODE = 'view' as const;
