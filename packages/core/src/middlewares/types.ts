export type MiddlewareState = {
	date: Date;
};
export type MiddlewareReturn = {
	data?: {
		[key: string]: unknown;
	};
};
export type Middleware = {
	name: string;
	options?: unknown;
	fn: (state: MiddlewareState) => MiddlewareReturn;
};
