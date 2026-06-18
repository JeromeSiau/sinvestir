import type { ReactNode } from "react";

import type { ChartRange } from "../../lib/chart-utils";
import { ChartDateScale } from "./ChartDateScale";
import { ChartRangeControl } from "./ChartRangeControl";

export type ChartLegendItem = {
  color: string;
  label: string;
};

type ChartCardProps = {
  badgeClassName: string;
  badgeLabel: string;
  children: ReactNode;
  dateScaleRightPaddingClassName?: string;
  getRangeLabel: (value: number) => string;
  hasData: boolean;
  legend: ChartLegendItem[];
  overline: string;
  range: ChartRange;
  ticks: number[];
  title: string;
  onRangeCommit: (range: ChartRange) => void;
};

export function ChartCard({
  badgeClassName,
  badgeLabel,
  children,
  dateScaleRightPaddingClassName,
  getRangeLabel,
  hasData,
  legend,
  overline,
  range,
  ticks,
  title,
  onRangeCommit,
}: ChartCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-transparent p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-light text-blue-light">{overline}</p>
          <h4 className="text-xl font-normal text-white">{title}</h4>
        </div>
        <span className={badgeClassName}>{badgeLabel}</span>
      </div>
      {hasData ? (
        <div className="mb-4 px-1 sm:px-3">
          <ChartRangeControl
            end={range.end}
            getLabel={getRangeLabel}
            onRangeCommit={onRangeCommit}
            start={range.start}
          />
        </div>
      ) : null}
      <div className="h-[360px] min-w-0 sm:h-[460px]">{children}</div>
      {hasData ? <ChartDateScale rightPaddingClassName={dateScaleRightPaddingClassName} ticks={ticks} /> : null}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-light text-blue-light">
        {legend.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-2">
            <span className="h-0.5 w-6 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
