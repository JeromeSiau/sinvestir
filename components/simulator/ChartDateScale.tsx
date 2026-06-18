import { cx } from "../../lib/classnames";
import { formatChartDate } from "../../lib/formatters";

type ChartDateScaleProps = {
  rightPaddingClassName?: string;
  ticks: number[];
};

export function ChartDateScale({ rightPaddingClassName = "pr-2", ticks }: ChartDateScaleProps) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "mt-1 flex justify-between pl-[68px] text-[11px] font-light text-blue-light/90",
        rightPaddingClassName,
      )}
    >
      {ticks.map((tick, index) => (
        <span key={tick} className={cx(index % 2 === 1 && "hidden sm:inline")}>
          {formatChartDate(tick)}
        </span>
      ))}
    </div>
  );
}
