import { NodeError } from '../../../../utils/constants';

export enum MomentErrorCode {
	OUT_OF_BOUNDS = 'OUT_OF_BOUNDS',
	INVALID_DATE = 'INVALID_DATE',
	INVALID_TIMEZONE = 'INVALID_TIMEZONE',
	INVALID_OFFSET_KEY = 'INVALID_OFFSET_KEY',
	INVALID_DIRECTION = 'INVALID_DIRECTION',
	INVALID_INPUT_OFFSET = 'INVALID_INPUT_OFFSET',
}

/**
 * Custom error class for Moment-specific exceptions.
 */
export class MomentError extends Error {
	readonly name = 'MomentError';
	readonly code: MomentErrorCode;

	/**
	 * Constructs a new MomentError.
	 *
	 * @param code - A predefined error code that describes the error type.
	 * @param message - A human-readable description of the error.
	 */
	constructor(code: MomentErrorCode, message: string) {
		super(`[${code}] ${message}`);
		this.code = code;

		if (typeof NodeError.captureStackTrace === 'function') {
			NodeError.captureStackTrace(this, new.target);
		}
	}
}
