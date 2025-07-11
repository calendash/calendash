import type { DateBoundsRaw } from '../../../src/types';
import { Moment } from '../../../src/helpers/moment';
import { DATE_BOUNDARIES } from '../../../src/utils/constants';

describe('Moment', () => {
	const bounds: DateBoundsRaw = {
		min: '2020-03-21T23:59:59.999Z',
		max: '2030-03-21T23:59:59.999Z',
	} as const;

	describe('constructor', () => {
		it('initializes with default values', () => {
			const today = new Date();
			const minDate = new Date(DATE_BOUNDARIES.min);
			const maxDate = new Date(DATE_BOUNDARIES.max);
			const moment = new Moment();
			expect(moment).toBeInstanceOf(Moment);
			expect({
				year: moment.date.getFullYear(),
				month: moment.date.getMonth(),
				day: moment.date.getDate(),
			}).toEqual({
				year: today.getFullYear(),
				month: today.getMonth(),
				day: today.getDate(),
			});
			expect(moment.bounds.max).toEqual(maxDate);
			expect(moment.bounds.min).toEqual(minDate);
		});

		it('initializes with given date within bounds', () => {
			const date = new Date('2025-03-21T23:59:59.999Z');
			const moment = new Moment(date, bounds);
			expect(moment).toBeInstanceOf(Moment);
			expect(moment.date).toEqual(date);
		});

		it('throws error if date is out of bounds', () => {
			const date = new Date('1900-01-01');
			expect(() => new Moment(date, bounds)).toThrow(
				'Target date is outside the specified bounds.'
			);
		});
	});

	describe('add()', () => {
		it('adds years offset correctly', () => {
			const moment = new Moment(new Date('2025-03-21T23:59:59.999Z'), bounds);
			moment.add({ years: 4 });
			expect(moment.date.getFullYear()).toBe(2029);

			moment.add({ years: -9 });
			expect(moment.date.getFullYear()).toBe(2020);
		});

		it('adds months offset correctly', () => {
			const moment = new Moment(new Date('2025-03-21T12:59:59.999Z'), bounds);
			moment.add({ months: 5 });
			expect(moment.date.getDate()).toBe(21);
			expect(moment.date.getMonth()).toBe(7); // August index
			expect(moment.date.getFullYear()).toBe(2025);

			moment.add({ months: -2 });
			expect(moment.date.getDate()).toBe(21);
			expect(moment.date.getMonth()).toBe(5); // June index
			expect(moment.date.getFullYear()).toBe(2025);
		});

		it('adds weeks offset correctly', () => {
			const moment = new Moment(new Date('2025-03-21T12:59:59.999Z'), bounds);
			moment.add({ weeks: 2 });
			expect(moment.date.getDate()).toBe(4);
			expect(moment.date.getMonth()).toBe(3); // April index
			expect(moment.date.getFullYear()).toBe(2025);

			moment.add({ weeks: -4 });
			expect(moment.date.getDate()).toBe(7);
			expect(moment.date.getMonth()).toBe(2); // March index
			expect(moment.date.getFullYear()).toBe(2025);
		});

		it('adds days offset correctly', () => {
			const moment = new Moment(new Date('2025-03-21T12:59:59.999Z'), bounds);
			moment.add({ days: 5 });
			expect(moment.date.getDate()).toBe(26);
			expect(moment.date.getMonth()).toBe(2); // March index
			expect(moment.date.getFullYear()).toBe(2025);

			moment.add({ days: -15 });
			expect(moment.date.getDate()).toBe(11);
			expect(moment.date.getMonth()).toBe(2); // March index
			expect(moment.date.getFullYear()).toBe(2025);
		});

		it('date is not updated if offset moves it out of bounds', () => {
			const moment = new Moment(new Date('2030-03-21T12:59:59.999Z'), bounds);
			moment.add({ days: 10 }); // moves out of max bound
			expect(moment.date.getDate()).toBe(21); // date unchanged
			expect(moment.date.getMonth()).toBe(2); // March index
			expect(moment.date.getFullYear()).toBe(2030);
		});
	});

	describe('isAdjacentDateVisible()', () => {
		it('returns true if adjacent date is within bounds', () => {
			const moment = new Moment(new Date('2025-03-21T23:59:59.999Z'), bounds);
			expect(moment.isAdjacentDateVisible('days', 1)).toBe(true); // 22
			expect(moment.isAdjacentDateVisible('days', -1)).toBe(true); // 20
		});

		it('returns false if adjacent (forward) date is out of bounds', () => {
			const moment = new Moment(new Date('2030-03-21T23:59:59.999Z'), bounds);
			expect(moment.isAdjacentDateVisible('days', 1)).toBe(false);
		});

		it('returns false if adjacent (backward) date is out of bounds', () => {
			const moment = new Moment(new Date('2020-03-21T23:59:59.999Z'), bounds);
			expect(moment.isAdjacentDateVisible('days', -1)).toBe(false);
		});

		it('returns true if adjacent (forward) decade is within bounds', () => {
			const moment = new Moment(new Date('2020-03-21T23:59:59.999Z'), bounds);
			expect(moment.isAdjacentDateVisible('decades', 1)).toBe(true);
		});
	});

	describe('from()', () => {
		it('jumps to specified date succesfully', () => {
			const moment = new Moment(new Date('2025-03-21T23:59:59.999Z'), bounds);
			const jumpDate = new Date('2030-03-21T23:59:59.999Z');
			moment.from(jumpDate);
			expect(moment.date).toEqual(jumpDate);
		});

		it('date is not updated if given jump date is out of bounds', () => {
			const baseDate = new Date('2025-03-21T23:59:59.999Z');
			const moment = new Moment(baseDate, bounds);
			moment.from(new Date('2030-03-22T23:59:59.999Z'));
			expect(moment.date).toEqual(baseDate);
		});
	});

	describe('toZonedDateTime()', () => {
		it('adjusts given input date with specified time zone', () => {
			const baseDate = new Date('2025-03-21T23:59:59.999Z');
			const moment = new Moment(baseDate, bounds);
			moment.toZonedDateTime('America/New_York');
			expect(moment.date.getHours()).not.toEqual(baseDate.getHours());
		});
	});
});
