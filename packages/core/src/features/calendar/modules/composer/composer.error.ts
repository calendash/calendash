import { NodeError } from '../../../../utils/constants';

export enum ComposerErrorCode {
	INVALID_DATE = 'INVALID_DATE',
	INVALID_VIEW = 'INVALID_VIEW',
}

/**
 * Custom error class for Composer-specific exceptions.
 */
export class ComposerError extends Error {
	readonly name = 'ComposerError';
	readonly code: ComposerErrorCode;

	/**
	 * Creates a new ComposerError instance.
	 *
	 * @param code - A predefined error code that indicates the type of failure.
	 * @param message - A human-readable message describing the error context.
	 */
	constructor(code: ComposerErrorCode, message: string) {
		super(`[${code}] ${message}`);
		this.code = code;

		if (typeof NodeError.captureStackTrace === 'function') {
			NodeError.captureStackTrace(this, new.target);
		}
	}
}
