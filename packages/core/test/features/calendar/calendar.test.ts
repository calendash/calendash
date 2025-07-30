import {
	Calendar,
	CalendarError,
	CalendarErrorCode,
	ComposerError,
	ComposerErrorCode,
	LayoutError,
	LayoutErrorCode,
	MomentError,
	MomentErrorCode,
} from '../../../src/features/calendar';
import type { Day, ViewType } from '../../../src/types';

describe('Calendar', () => {
	describe('constructor', () => {
		const today = new Date();
		const calendar = new Calendar();

		it('initializes with default values', () => {
			expect(calendar.view).toBe('day');
			expect(calendar.target).toBeInstanceOf(Date);
			expect({
				year: calendar.target.getFullYear(),
				month: calendar.target.getMonth(),
				day: calendar.target.getDate(),
			}).toEqual({
				year: today.getFullYear(),
				month: today.getMonth(),
				day: today.getDate(),
			});
			expect(calendar.hasNextDate).toBe(true);
			expect(calendar.hasPrevDate).toBe(true);
			expect(calendar.hasNextView).toBe(true);
			expect(calendar.hasPrevView).toBe(false);
			expect(calendar.data).not.toBeNull();
		});

		it('calendar data is correct for default view', () => {
			expect((calendar.data as Day).isCurrentDay).toBe(true);
			(calendar.data as Day).cells
				.flatMap((row) => row)
				.forEach((cell) => {
					expect(cell.timestamp).toBeGreaterThanOrEqual(today.getTime());
					expect(cell.dayOfMonth).toBe(today.getDate());
					expect(cell.isSelected).toBe(true);
					expect(cell.isDisabled).toBe(false);
					expect(cell.monthIndex).toBe(today.getMonth());
					expect(cell.year).toBe(today.getFullYear());
					expect(cell.weekday).toBe(today.getDay());
				});
		});

		it('initializes with specified time zone', () => {
			const date = new Date('2025-03-24T12:00:00.000Z');
			const calendar = new Calendar({ date, timeZone: 'America/New_York' });
			expect(calendar.target).toBeInstanceOf(Date);
			expect(calendar.target).not.toEqual(date);
		});

		it('throws error if invalid date is provided', () => {
			expect(() => new Calendar({ date: 'invalid-date' })).toThrow(
				new MomentError(
					MomentErrorCode.INVALID_DATE,
					'Invalid date provided: Could not convert to Date object.'
				)
			);
		});

		it('throws error if all calendar views are skipped', () => {
			const skipViews: ViewType[] = ['day', 'week', 'month', 'year', 'decade'];
			expect(() => new Calendar({ skipViews })).toThrow(
				new LayoutError(
					LayoutErrorCode.INVALID_SKIP_VIEWS,
					'All views are excluded via `skipViews`. At least one view must remain available.'
				)
			);
		});

		it('throws error if time zone is invalid', () => {
			expect(() => new Calendar({ timeZone: 'invalid-time-zone' })).toThrow(
				new ComposerError(
					ComposerErrorCode.INVALID_DATE,
					'Invalid date or timezone provided: Invalid time zone specified: invalid-time-zone'
				)
			);
		});
	});

	describe('jumpToDate()', () => {
		it('jumps to the specified date', () => {
			const calendar = new Calendar({ date: new Date('2023-05-24T12:00:00.000Z') });
			expect((calendar.data as Day).isCurrentDay).toBe(false);

			const newDate = new Date('2025-03-24T12:00:00.000Z');
			calendar.jumpToDate(newDate);
			expect(calendar.target).toBeInstanceOf(Date);
			expect(calendar.target).toEqual(newDate);
		});

		it('throws error if date is invalid', () => {
			const calendar = new Calendar();
			expect(() => calendar.jumpToDate('invalid-date')).toThrow(
				new MomentError(
					MomentErrorCode.INVALID_DATE,
					'Invalid date provided: Could not convert to Date object.'
				)
			);
		});
	});

	describe('navigate()', () => {
		it('navigates the calendar by `date` mode and direction', () => {
			const calendar = new Calendar({ date: new Date('2025-03-24T12:00:00.000Z') });
			expect((calendar.data as Day).isCurrentDay).toBe(false);

			calendar.navigate('date', 1);
			expect(calendar.target).toBeInstanceOf(Date);
			expect(calendar.target).toEqual(new Date('2025-03-25T12:00:00.000Z'));
		});

		it('navigates the calendar by `view` mode and direction', () => {
			const calendar = new Calendar({ view: 'week' });
			expect(calendar.view).toBe('week');

			calendar.navigate('view', -1);
			expect(calendar.view).toBe('day');
		});

		it('throws error if invalid navigation mode is provided', () => {
			const calendar = new Calendar();
			// @ts-ignore
			expect(() => calendar.navigate('invalid-mode', 1)).toThrow(
				new CalendarError(
					CalendarErrorCode.INVALID_NAV_MODE,
					'Unsupported navigation mode. Expected one of: date, view.'
				)
			);
		});
	});
});
