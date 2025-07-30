import { disable } from '../../src/middlewares';

describe('disable()', () => {
	it('returns middleware object with correct properties', () => {
		const { name, options, fn } = disable();
		expect(name).toEqual('disable');
		expect(options).toEqual({});
		expect(fn({ date: new Date() })).toEqual({ data: { isDisabled: false } });
	});

	it('returns a middleware with name and options, and correctly disables only the specified dates', () => {
		const { name, options, fn } = disable({
			dates: ['2025-12-25', '2025-01-01'],
		});
		expect(name).toEqual('disable');
		expect(options).toEqual({
			dates: ['2025-12-25', '2025-01-01'],
		});
		expect(fn({ date: new Date('2025-12-25T12:00:00.000Z') })).toEqual({
			data: { isDisabled: true },
		});
		expect(fn({ date: new Date('2025-01-01T12:00:00.000Z') })).toEqual({
			data: { isDisabled: true },
		});
		expect(fn({ date: new Date('2025-12-28T12:00:00.000Z') })).toEqual({
			data: { isDisabled: false },
		});
	});

	it('returns a middleware with name and options, and correctly disables weekends', () => {
		const { name, options, fn } = disable({
			weekends: true,
		});
		expect(name).toEqual('disable');
		expect(options).toEqual({
			weekends: true,
		});

		// Check Saturday day
		expect(fn({ date: new Date('2025-07-26T12:00:00.000Z') })).toEqual({
			data: { isDisabled: true },
		});

		// Check Sunday day
		expect(fn({ date: new Date('2025-06-08T12:00:00.000Z') })).toEqual({
			data: { isDisabled: true },
		});

		// Check Saturday day
		expect(fn({ date: new Date('2025-05-31T12:00:00.000Z') })).toEqual({
			data: { isDisabled: true },
		});

		// Check Friday day
		expect(fn({ date: new Date('2025-04-04T12:00:00.000Z') })).toEqual({
			data: { isDisabled: false },
		});
	});

	it('returns a middleware with name and options, and correctly disables weekends excluding specific dates', () => {
		const { name, options, fn } = disable({
			weekends: true,
			exclude: ['2025-06-08', '2025-07-26'], // Sunday and Saturday respectively
		});
		expect(name).toEqual('disable');
		expect(options).toEqual({
			weekends: true,
			exclude: ['2025-06-08', '2025-07-26'],
		});

		// Check Saturday excluded day
		expect(fn({ date: new Date('2025-07-26T12:00:00.000Z') })).toEqual({
			data: { isDisabled: false },
		});

		// Check Sunday excluded day
		expect(fn({ date: new Date('2025-06-08T12:00:00.000Z') })).toEqual({
			data: { isDisabled: false },
		});

		// Check Saturday day
		expect(fn({ date: new Date('2025-05-31T12:00:00.000Z') })).toEqual({
			data: { isDisabled: true },
		});

		// Check Sunday day
		expect(fn({ date: new Date('2025-04-06T12:00:00.000Z') })).toEqual({
			data: { isDisabled: true },
		});
	});
});
