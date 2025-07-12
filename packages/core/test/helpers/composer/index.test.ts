import { Composer } from '../../../src/helpers/composer';

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
				expect(cell.day).toBe(1);
				expect(cell.month).toBe(0);
				expect(cell.year).toBe(2025);
				expect(cell.isSelected).toBe(true);
				expect(cell.dayOfWeek).toBe(3);
				expect(cell.isDisabled).toBe(false);
			});
		});

		test('throws error if invalid time zone is provided', () => {
			const tz = 'invalid-timeZone';
			expect(() => {
				new Composer(tz);
			}).toThrow(`Invalid time zone specified: ${tz}`);
		});

		test('throws error if invalid bounds are provided', () => {
			expect(() => {
				new Composer(null, { min: 'invalid-date' });
			}).toThrow('Invalid date input. Could not convert to Date object.');
		});
	});
});
