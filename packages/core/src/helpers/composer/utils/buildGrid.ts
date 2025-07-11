import type { Grid } from './types';

export function buildGrid<T>(
	rows: number,
	cols: number,
	builder: (row: number, col: number) => T
): Grid<T> {
	return Array.from({ length: rows }, (_, i) => {
		return Array.from({ length: cols }, (_, j) => builder(i, j));
	});
}
