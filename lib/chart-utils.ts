import { formatDate } from "./formatters";
import type { ChartPoint } from "./simulation";

export const MIN_CHART_RANGE_PERCENT = 5;

export type ChartRange = {
  start: number;
  end: number;
};

export type ChartPointWithMeta = ChartPoint & {
  profit: number;
  timestamp: number;
};

export type ChartViewport = {
  hasVisibleData: boolean;
  points: ChartPointWithMeta[];
  ticks: number[];
};

export function toChartPoints(points: ChartPoint[]): ChartPointWithMeta[] {
  return points.map((point) => ({
    ...point,
    profit: point.value - point.invested,
    timestamp: new Date(`${point.date}T00:00:00.000Z`).getTime(),
  }));
}

export function getVisibleChartPoints(points: ChartPointWithMeta[], range: ChartRange) {
  if (points.length < 2) return points;

  const startIndex = Math.floor((range.start / 100) * (points.length - 1));
  const endIndex = Math.max(
    startIndex + 2,
    Math.ceil((range.end / 100) * (points.length - 1)) + 1,
  );

  return points.slice(startIndex, Math.min(endIndex, points.length));
}

export function getChartTicks(points: Array<{ timestamp: number }>) {
  if (points.length <= 7) return points.map((point) => point.timestamp);

  const targetTickCount = 7;
  const step = Math.max(1, Math.floor((points.length - 1) / (targetTickCount - 1)));
  const ticks = points.filter((_, index) => index % step === 0).map((point) => point.timestamp);
  const lastDate = points[points.length - 1]?.timestamp;

  if (lastDate && ticks[ticks.length - 1] !== lastDate) {
    ticks.push(lastDate);
  }

  return ticks;
}

export function getChartViewport(points: ChartPointWithMeta[], range: ChartRange): ChartViewport {
  const visiblePoints = getVisibleChartPoints(points, range);

  return {
    hasVisibleData: visiblePoints.length > 1,
    points: visiblePoints,
    ticks: getChartTicks(visiblePoints),
  };
}

export function getRangeLabel(
  points: ChartPointWithMeta[],
  value: number,
  fallbackStartDate: string,
  fallbackEndDate: string,
) {
  if (points.length < 2) {
    return formatDate(value >= 100 ? fallbackEndDate : fallbackStartDate);
  }

  const index = Math.min(
    points.length - 1,
    Math.max(0, Math.round((value / 100) * (points.length - 1))),
  );

  return formatDate(points[index]?.date ?? (value >= 100 ? fallbackEndDate : fallbackStartDate));
}
