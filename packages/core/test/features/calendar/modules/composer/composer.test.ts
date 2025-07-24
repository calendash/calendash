import {
	Composer,
	ComposerError,
	ComposerErrorCode,
} from '../../../../../src/features/calendar/modules/composer';

describe('Composer', () => {
	const mockDate = new Date(2025, 0, 1); // Jan 1, 2025

	describe('constructor', () => {
		it('initializes with default values', () => {
			const composer = new Composer();
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

		test('throws error if invalid time zone is provided', () => {
			const tz = 'invalid-timeZone';
			const createComposer = () => new Composer({ timeZone: tz });
			expect(createComposer).toThrow(
				new ComposerError(
					ComposerErrorCode.INVALID_DATE,
					`Invalid date or timezone provided: Invalid time zone specified: ${tz}`
				)
			);
		});

		test('throws error if invalid bounds are provided', () => {
			const createComposer = () => new Composer({ bounds: { min: 'invalid-date' } });
			expect(createComposer).toThrow(
				new ComposerError(
					ComposerErrorCode.INVALID_DATE,
					'Invalid date or timezone provided: Could not convert to Date object.'
				)
			);
		});
	});
});
