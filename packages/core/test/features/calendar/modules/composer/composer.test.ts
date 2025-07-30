import {
	Composer,
	ComposerError,
	ComposerErrorCode,
} from '../../../../../src/features/calendar/modules/composer';
import type { Middleware, ViewType } from '../../../../../src/types';

const testCases = [
	['day', { rows: 1, cols: 1 }],
	['week', { rows: 1, cols: 7 }],
	['month', { rows: 6, cols: 7 }],
	['year', { rows: 4, cols: 3 }],
	['decade', { rows: 4, cols: 3 }],
] as [ViewType, { rows: number; cols: number }][];

// Define test function separately to avoid deep nesting
function runViewTest(view: ViewType, expected: { rows: number; cols: number }) {
	const composer = new Composer();
	const result = composer.data(view, new Date());

	expect(result).not.toBeNull();
	expect(result.cells.length).toBe(expected.rows);

	result.cells.forEach((row) => {
		expect(row.length).toBe(expected.cols);
	});
}

describe('Composer', () => {
	describe('constructor', () => {
		const mockDate = new Date(2025, 0, 1); // Jan 1, 2025

		it('initializes with default values', () => {
			const mockMiddlewares = [
				{ name: 'test', fn: () => ({ data: { isDisabled: false } }) },
				{ fn: () => ({ data: { isDisabled: false } }) },
			] as Middleware[];
			const composer = new Composer({ middlewares: mockMiddlewares });
			expect(composer).toBeInstanceOf(Composer);
			expect(typeof composer.data).toBe('function');

			const result = composer.data('day', mockDate);
			expect(result).toBeDefined();
			expect(result.isCurrentDay).toBe(false);

			result.cells.flat().forEach((cell) => {
				expect(cell.dayOfMonth).toBe(1);
				expect(cell.weekday).toBe(3);
				expect(cell.monthIndex).toBe(0);
				expect(cell.year).toBe(2025);
				expect(cell.isSelected).toBe(true);
				expect(cell.isDisabled).toBe(false);
			});
		});

		it('throws error if invalid time zone is provided', () => {
			const tz = 'invalid-timeZone';
			const createComposer = () => new Composer({ timeZone: tz });
			expect(createComposer).toThrow(
				new ComposerError(
					ComposerErrorCode.INVALID_DATE,
					`Invalid date or timezone provided: Invalid time zone specified: ${tz}`
				)
			);
		});

		it('throws error if invalid bounds are provided', () => {
			const createComposer = () => new Composer({ bounds: { min: 'invalid-date' } });
			expect(createComposer).toThrow(
				new ComposerError(
					ComposerErrorCode.INVALID_DATE,
					'Invalid date or timezone provided: Could not convert to Date object.'
				)
			);
		});
	});

	describe('data()', () => {
		it('throws error if invalid date is provided', () => {
			const composer = new Composer();
			// @ts-ignore
			expect(() => composer.data('day', 'invalid-date')).toThrow(
				new ComposerError(
					ComposerErrorCode.INVALID_DATE,
					'Target date must be a valid Date object.'
				)
			);
		});

		it('throws error if invalid view is provided', () => {
			const composer = new Composer();
			// @ts-ignore
			expect(() => composer.data('invalid-view', new Date())).toThrow(
				new ComposerError(
					ComposerErrorCode.INVALID_VIEW,
					'Unknown view type "invalid-view". Expected one of: day, week, month, year, decade.'
				)
			);
		});

		it.each(testCases)('returns correct data shape for %s view', (view, expected) => {
			runViewTest(view, expected);
		});
	});
});
