import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartPointWithMeta } from "../../lib/chart-utils";
import {
  formatCompactCurrency,
  formatNumber,
  formatTooltipDate,
  tooltipCurrency,
  tooltipUnits,
} from "../../lib/formatters";
import { CHART_INITIAL_DIMENSION, CHART_SERIES_ANIMATION, CHART_TOOLTIP_STYLE } from "./chart-config";

type HistoryChartProps = {
  animationKey: string;
  assetSymbol: string;
  points: ChartPointWithMeta[];
  ticks: number[];
};

export function HistoryChart({ animationKey, assetSymbol, points, ticks }: HistoryChartProps) {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      initialDimension={CHART_INITIAL_DIMENSION}
      minWidth={0}
      minHeight={280}
    >
      <AreaChart key={animationKey} data={points} margin={{ left: 4, right: 8, top: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="capitalGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1098f7" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#1098f7" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
        <XAxis
          dataKey="timestamp"
          domain={["dataMin", "dataMax"]}
          height={8}
          interval={0}
          scale="time"
          tick={false}
          ticks={ticks}
          tickLine={false}
          type="number"
          axisLine={false}
        />
        <YAxis
          yAxisId="currency"
          tickFormatter={formatCompactCurrency}
          tick={{ fill: "#7899ce", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={68}
        />
        <YAxis
          yAxisId="units"
          orientation="right"
          tickFormatter={(value) => formatNumber(Number(value), 2)}
          tick={{ fill: "#7899ce", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={52}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          formatter={(value, name) => {
            if (name === "Acquis") return [tooltipUnits(value, assetSymbol), "Acquis"];
            return [tooltipCurrency(value), name];
          }}
          labelFormatter={(label) => `Date : ${formatTooltipDate(label)}`}
        />
        {/* Slider commits are debounced, so the short Recharts reveal runs only after a stable range update. */}
        <Area
          yAxisId="currency"
          dataKey="value"
          fill="url(#capitalGradient)"
          name="Capital"
          stroke="#1098f7"
          strokeWidth={2.4}
          type="monotone"
          {...CHART_SERIES_ANIMATION}
        />
        <Line
          yAxisId="currency"
          dataKey="invested"
          dot={false}
          name="Investi"
          stroke="#f8d047"
          strokeDasharray="5 6"
          strokeWidth={2}
          type="monotone"
          {...CHART_SERIES_ANIMATION}
        />
        <Line
          yAxisId="units"
          dataKey="units"
          dot={false}
          name="Acquis"
          stroke="#8fd3ff"
          strokeWidth={2}
          type="monotone"
          {...CHART_SERIES_ANIMATION}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
