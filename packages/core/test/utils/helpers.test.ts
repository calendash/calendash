import type { DateBounds } from '../../src/types';
import {
	adjustDateTimeZone,
	clamp,
	createGrid,
	getDayKey,
	isDate,
	isDateDisabled,
	isInteger,
	isMiddleware,
	isPlainObject,
	isSameDay,
	isSameDecade,
	isSameMonth,
	isSameWeek,
	isSameYear,
	isWithinBounds,
	toDate,
} from '../../src/utils/helpers';

describe('Helper functions', () => {
	describe('isDate()', () => {
		['2025-03-02', 1234, { test: 'hello world' }, ['test'], undefined, null].forEach((item) => {
			it(`returns false when ${JSON.stringify(item)} is passed`, () => {
				const result = isDate(item);
				expect(result).toBe(false);
			});
		});

		it('returns true when Date object is passed', () => {
			const result = isDate(new Date());
			expect(result).toBe(true);
		});
	});

	describe('isWithinBounds()', () => {
		const bounds: DateBounds = {
			min: new Date('2020-01-01T12:00:00.999Z'),
			max: new Date('2030-01-01T12:00:00.999Z'),
		};

		it('returns true when input date is within boundaries', () => {
			const today = new Date();
			const result = isWithinBounds(today, bounds);
			expect(result).toBe(true);
		});

		it('returns false when input date exceeds the max bound', () => {
			// One second after the max bound
			const afterMax = new Date('2030-01-01T12:00:01.999Z');
			const result = isWithinBounds(afterMax, bounds);
			expect(result).toBe(false);
		});

		it('returns false when input date is earlier than the min bound', () => {
			// One second before the min bound
			const beforeMin = new Date('2000-01-01T11:59:59.999Z');
			const result = isWithinBounds(beforeMin, bounds);
			expect(result).toBe(false);
		});
	});

	describe('adjustDateTimeZone()', () => {
		it('returns adjusted date in the specified time zone', () => {
			const date = new Date('2025-03-24T12:00:00.999Z');
			const adjustedDate = adjustDateTimeZone(new Date(date.toISOString()), 'America/New_York');

			// Check if the date hour is adjusted correctly
			expect(adjustedDate).toBeInstanceOf(Date);
			expect(adjustedDate.getHours()).not.toBe(date.getHours());
		});

		it('throws error when time zone is invalid', () => {
			expect(() => {
				adjustDateTimeZone(new Date(), 'invalid-time-zone');
			}).toThrow(new RangeError('Invalid time zone specified: invalid-time-zone'));
		});

		it('throws error when date is invalid', () => {
			expect(() => {
				adjustDateTimeZone(new Date('invalid-date'), 'America/New_York');
			}).toThrow(new RangeError('Invalid time value'));
		});
	});

	describe('toDate()', () => {
		['2020-01-01T12:00:00.999Z', Date.now(), new Date()].forEach((item) => {
			it(`returns a Date object when ${JSON.stringify(item)} is passed`, () => {
				const result = toDate(item);
				expect(result).toBeInstanceOf(Date);
				expect(typeof result.getTime()).toBe('number');
			});
		});

		it('throws error when invalid date string is passed', () => {
			expect(() => toDate('invalid-date')).toThrow(new Error('Could not convert to Date object.'));
		});

		it('throws error when unsupported date type is passed', () => {
			expect(() => toDate({ test: 'hello world' })).toThrow(
				new Error('Unsupported type for Date conversion. Expected string or number.')
			);
		});
	});

	describe('isSameDay()', () => {
		const date = new Date('2025-03-24T10:00:00.999Z');

		it('returns true when input date is same day as the reference date', () => {
			// Check if the date is the same day as the reference date
			// even though the time component is different
			const result = isSameDay(date, new Date('2025-03-24T22:00:00.999Z'));
			expect(result).toBe(true);
		});

		it('returns false when input date is not same day as the reference date', () => {
			// Check if the date is not the same day as the reference date
			const result = isSameDay(date, new Date('2025-03-25T10:00:00.999Z'));
			expect(result).toBe(false);
		});
	});

	describe('isSameDecade()', () => {
		const date = new Date('2025-03-24T10:00:00.999Z');

		it('returns true when input date is same decade as the reference date', () => {
			// Check if the date is the same decade as the reference date
			const result = isSameDecade(date, new Date('2020-06-01T10:00:00.999Z'));
			expect(result).toBe(true);
		});

		it('returns false when input date is not same decade as the reference date', () => {
			// Check if the date is not the same decade as the reference date
			const result = isSameDecade(date, new Date('2019-03-24T10:00:00.999Z'));
			expect(result).toBe(false);
		});
	});

	describe('isSameMonth()', () => {
		const date = new Date('2025-03-24T10:00:00.999Z');

		it('returns true when input date is same month as the reference date', () => {
			// Check if the date is the same month and year as the reference date
			// even though the day component is different
			const result = isSameMonth(date, new Date('2025-03-01T10:00:00.999Z'));
			expect(result).toBe(true);
		});

		it('returns false when input date is not same month/year as the reference date', () => {
			const result = isSameMonth(date, new Date('2024-03-24T10:00:00.999Z'));
			expect(result).toBe(false);
		});
	});

	describe('isSameWeek()', () => {
		const date = new Date('2025-03-29T10:00:00.999Z');

		it('returns true when input date is same week/month/year as the reference date', () => {
			const result = isSameWeek(date, new Date('2025-03-23T10:00:00.999Z'));
			expect(result).toBe(true);
		});

		it('returns false when input date is not same week/month/year as the reference date', () => {
			const result = isSameWeek(date, new Date('2025-03-22T10:00:00.999Z'));
			expect(result).toBe(false);
		});
	});

	describe('isSameYear()', () => {
		const date = new Date('2025-03-29T10:00:00.999Z');

		it('returns true when input date is same year as the reference date', () => {
			const result = isSameYear(date, new Date('2025-08-01T10:00:00.999Z'));
			expect(result).toBe(true);
		});

		it('returns false when input date is not same year as the reference date', () => {
			const result = isSameYear(date, new Date('2024-03-22T10:00:00.999Z'));
			expect(result).toBe(false);
		});
	});

	describe('getDayKey()', () => {
		it('returns a date string in YYYY-MM-DD format for a given date', () => {
			const result = getDayKey(new Date('2025-08-01T10:00:00.999Z'));
			expect(result).toBe('2025-08-01');
		});
	});

	describe('isDateDisabled()', () => {
		const bounds: DateBounds = {
			min: new Date('2020-01-01T12:00:00.999Z'),
			max: new Date('2030-01-01T12:00:00.999Z'),
		};

		it('returns true when date is outside bounds', () => {
			const result = isDateDisabled(new Date('2019-12-31T10:00:00.999Z'), bounds);
			expect(result).toBe(true);
		});

		it('returns true when middleware function returns true', () => {
			const disableMiddleware = {
				name: 'disable',
				fn: () => ({ data: { isDisabled: true } }),
			};
			const result = isDateDisabled(
				new Date('2025-12-31T10:00:00.999Z'),
				bounds,
				disableMiddleware
			);
			expect(result).toBe(true);
		});

		it('returns false when middleware name is not provided', () => {
			const disableMiddleware = {
				fn: () => ({ data: { isDisabled: true } }),
			};
			// @ts-ignore
			const result = isDateDisabled(
				new Date('2025-12-31T10:00:00.999Z'),
				bounds,
				disableMiddleware
			);
			expect(result).toBe(false);
		});

		it('returns false when middleware function returns empty data', () => {
			const disableMiddleware = {
				name: 'disable',
				fn: () => ({}),
			};
			const result = isDateDisabled(
				new Date('2025-12-31T10:00:00.999Z'),
				bounds,
				disableMiddleware
			);
			expect(result).toBe(false);
		});

		it('returns false when date is within bounds & no middlewares are provided', () => {
			const result = isDateDisabled(new Date('2025-12-31T10:00:00.999Z'), bounds);
			expect(result).toBe(false);
		});
	});

	describe('createGrid()', () => {
		const builder = (row: number, col: number) => ({ [`row${row}`]: `col-${col}` });

		it('returns an array of objects with the specified number of rows and columns', () => {
			const result = createGrid(3, 2, builder);
			expect(result).toEqual([
				[{ row0: 'col-0' }, { row0: 'col-1' }],
				[{ row1: 'col-0' }, { row1: 'col-1' }],
				[{ row2: 'col-0' }, { row2: 'col-1' }],
			]);
		});
	});

	describe('isPlainObject()', () => {
		it('returns true when input is a plain object', () => {
			const result = isPlainObject({ test: 'hello world' });
			expect(result).toBe(true);
		});

		it('returns false when input is an array', () => {
			const result = isPlainObject([1, 2, 3]);
			expect(result).toBe(false);
		});

		[1234, 'test', null, undefined].forEach((item) => {
			it(`returns false when input is ${JSON.stringify(item)}`, () => {
				const result = isPlainObject(item);
				expect(result).toBe(false);
			});
		});
	});

	describe('isMiddleware()', () => {
		it('returns true when input is a middleware object', () => {
			const result = isMiddleware({ name: 'test', fn: () => {} });
			expect(result).toBe(true);
		});

		it('returns false when input is missing name property', () => {
			const result = isMiddleware({ fn: () => {} });
			expect(result).toBe(false);
		});

		it('returns false when input is missing fn property', () => {
			const result = isMiddleware({ name: 'test' });
			expect(result).toBe(false);
		});

		it('returns false when input is not an object', () => {
			const result = isMiddleware('test');
			expect(result).toBe(false);
		});
	});

	describe('clamp()', () => {
		it('returns the input value if it is within the specified range', () => {
			const result = clamp(10, 0, 20);
			expect(result).toBe(10);
		});

		it('returns the minimum value if the input value is less than the minimum', () => {
			const result = clamp(0, 10, 20);
			expect(result).toBe(10);
		});

		it('returns the maximum value if the input value is greater than the maximum', () => {
			const result = clamp(30, 0, 20);
			expect(result).toBe(20);
		});
	});

	describe('isInteger()', () => {
		it('returns true when input is an integer', () => {
			const result = isInteger(10);
			expect(result).toBe(true);
		});

		[10.5, '10', true].forEach((item) => {
			it(`returns false when input is ${JSON.stringify(item)}`, () => {
				const result = isInteger(item);
				expect(result).toBe(false);
			});
		});
	});
});
