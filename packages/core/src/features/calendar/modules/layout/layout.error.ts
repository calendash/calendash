import { NodeError } from '../../../../utils/constants';

export enum LayoutErrorCode {
	INVALID_SKIP_VIEWS = 'INVALID_SKIP_VIEWS',
	INVALID_DIRECTION = 'INVALID_DIRECTION',
}

/**
 * Custom error class for Layout-specific exceptions.
 */
export class LayoutError extends Error {
	readonly name = 'LayoutError';
	readonly code: LayoutErrorCode;

	/**
	 * Constructs a new LayoutError.
	 *
	 * @param code - A predefined error code that describes the error type.
	 * @param message - A human-readable description of the error.
	 */
	constructor(code: LayoutErrorCode, message: string) {
		super(`[${code}] ${message}`);
		this.code = code;

		if (typeof NodeError.captureStackTrace === 'function') {
			NodeError.captureStackTrace(this, new.target);
		}
	}
}
