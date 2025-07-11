import type { ViewOffsets } from '../types';

type ViewOffsetKey = keyof ViewOffsets;
type ViewOffsetHandler = (date: Date, offset: number) => void;

/**
 * Mapping of view offset keys to their corresponding handler functions.
 *
 * Each handler function modifies the provided `Date` by adding or subtracting
 * the given offset in the respective time unit.
 *
 * - `decades`: Adjusts the year by offset * 10.
 * - `years`: Adjusts the year by offset.
 * - `months`: Adjusts the month by offset.
 * - `weeks`: Adjusts the date by offset * 7 days.
 * - `days`: Adjusts the date by offset.
 *
 * @example
 * dateOffsetStrategies.years(new Date(2025, 0, 1), 2); // Advances date by 2 years
 */
export const dateOffsetStrategies: Record<ViewOffsetKey, ViewOffsetHandler> = {
	decades: (date, offset) => {
		date.setFullYear(date.getFullYear() + offset * 10);
	},
	years: (date, offset) => {
		date.setFullYear(date.getFullYear() + offset);
	},
	months: (date, offset) => {
		date.setMonth(date.getMonth() + offset);
	},
	weeks: (date, offset) => {
		date.setDate(date.getDate() + offset * 7);
	},
	days: (date, offset) => {
		date.setDate(date.getDate() + offset);
	},
} as const;
