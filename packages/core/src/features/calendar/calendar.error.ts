import { NodeError } from '../../utils/constants';

export enum CalendarErrorCode {
	INVALID_NAV_MODE = 'INVALID_NAV_MODE',
}

/**
 * Custom error class for Calendar-specific exceptions.
 */
export class CalendarError extends Error {
	readonly name = 'CalendarError';
	readonly code: CalendarErrorCode;

	/**
	 * Creates a new CalendarError instance.
	 *
	 * @param code - A predefined error code that indicates the type of failure.
	 * @param message - A human-readable message describing the error context.
	 */
	constructor(code: CalendarErrorCode, message: string) {
		super(`[${code}] ${message}`);
		this.code = code;

		if (typeof NodeError.captureStackTrace === 'function') {
			NodeError.captureStackTrace(this, new.target);
		}
	}
}
