import { jestConfig } from '@calendash/config';

/** @type {import('jest').Config} */
export default {
	...jestConfig,
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.spec.json' }],
	},
	testEnvironment: 'node',
};
