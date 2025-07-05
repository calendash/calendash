import type { Grid } from '../utils';

type BuilderFn<T> = (row: number, col: number) => T;

export function buildGrid<T>(rows: number, cols: number, builder: BuilderFn<T>): Grid<T> {
	return Array.from({ length: rows }, (_, i) => {
		return Array.from({ length: cols }, (_, j) => builder(i, j));
	});
}
