import { day, week, month, year, decade } from '../../builders';
import type { ViewData, BuilderContext, ViewType } from '../../utils';

type BuilderHandler<V extends ViewType> = (ctx: BuilderContext) => ViewData[V];

type DataBuilders = {
	[V in ViewType]: BuilderHandler<V>;
};

export const dataBuilders: DataBuilders = {
	day,
	week,
	month,
	year,
	decade,
} as const;
