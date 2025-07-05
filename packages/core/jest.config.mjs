import { jestConfig } from '@calendash/shared';

/** @type {import('jest').Config} */
export default {
	...jestConfig,
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.spec.json' }],
	},
	testEnvironment: 'node',
};
