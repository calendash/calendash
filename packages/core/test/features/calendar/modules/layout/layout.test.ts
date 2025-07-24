import {
	Layout,
	LayoutError,
	LayoutErrorCode,
} from '../../../../../src/features/calendar/modules/layout';
import { VIEWS, DIRECTION_NEXT, DIRECTION_PREV } from '../../../../../src/utils/constants';

describe('Layout', () => {
	describe('constructor', () => {
		it('initializes with default values', () => {
			const layout = new Layout();
			expect(layout.view).toBe(VIEWS[0]);
		});

		it('initializes with a specific target view', () => {
			const layout = new Layout({ viewTarget: 'week' });
			expect(layout.view).toBe('week');
		});

		it('falls back to default view if target view is skipped', () => {
			const layout = new Layout({ viewTarget: 'week', skipViews: ['week'] });
			expect(layout.view).toBe(VIEWS[0]);
		});

		it('throws if all views are skipped', () => {
			expect(() => new Layout({ skipViews: [...VIEWS] })).toThrow(
				new LayoutError(
					LayoutErrorCode.INVALID_SKIP_VIEWS,
					'All views are excluded via `skipViews`. At least one view must remain available.'
				)
			);
		});
	});

	describe('getAdjacentView', () => {
		it('returns the next view', () => {
			const layout = new Layout({ viewTarget: VIEWS[0] });
			const next = layout.getAdjacentView(DIRECTION_NEXT);
			expect(next).toBe(VIEWS[1]);
		});

		it('returns the next view even if integer value is other than 1', () => {
			const layout = new Layout({ viewTarget: VIEWS[0] });
			const next = layout.getAdjacentView(10);
			expect(next).toBe(VIEWS[1]);
		});

		it('returns the previous view', () => {
			const layout = new Layout({ viewTarget: VIEWS[1] });
			const prev = layout.getAdjacentView(DIRECTION_PREV);
			expect(prev).toBe(VIEWS[0]);
		});

		it('returns the previous view even if integer value is other than -1', () => {
			const layout = new Layout({ viewTarget: VIEWS[1] });
			const prev = layout.getAdjacentView(-10);
			expect(prev).toBe(VIEWS[0]);
		});

		it('returns undefined if no adjacent view exists', () => {
			const layout = new Layout({ viewTarget: VIEWS[0] });
			const prev = layout.getAdjacentView(DIRECTION_PREV);
			expect(prev).toBeUndefined();
		});

		it('throws if direction is not an integer', () => {
			const layout = new Layout();
			// @ts-ignore
			expect(() => layout.getAdjacentView('left')).toThrow(
				new LayoutError(
					LayoutErrorCode.INVALID_DIRECTION,
					'Invalid direction "left". Expected an integer value of -1 or 1.'
				)
			);
		});
	});

	describe('shift', () => {
		it('shifts to next view if available', () => {
			const layout = new Layout({ viewTarget: VIEWS[0] });
			layout.shift(DIRECTION_NEXT);
			expect(layout.view).toBe(VIEWS[1]);
		});

		it('does not shift if no adjacent view exists', () => {
			const layout = new Layout({ viewTarget: VIEWS[0] });
			layout.shift(DIRECTION_PREV);
			expect(layout.view).toBe(VIEWS[0]);
		});

		it('returns the instance after shift', () => {
			const layout = new Layout();
			const result = layout.shift(DIRECTION_NEXT);
			expect(result).toBe(layout);
		});
	});
});
