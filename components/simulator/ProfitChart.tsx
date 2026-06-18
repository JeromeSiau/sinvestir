import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartPointWithMeta } from "../../lib/chart-utils";
import { formatCompactCurrency, formatTooltipDate, tooltipCurrency } from "../../lib/formatters";
import { CHART_INITIAL_DIMENSION, CHART_SERIES_ANIMATION, CHART_TOOLTIP_STYLE } from "./chart-config";

type ProfitChartProps = {
  accentColor: string;
  animationKey: string;
  points: ChartPointWithMeta[];
  ticks: number[];
};

export function ProfitChart({ accentColor, animationKey, points, ticks }: ProfitChartProps) {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      initialDimension={CHART_INITIAL_DIMENSION}
      minWidth={0}
      minHeight={280}
    >
      <LineChart key={animationKey} data={points} margin={{ left: 4, right: 8, top: 10, bottom: 0 }}>
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
          tickFormatter={formatCompactCurrency}
          tick={{ fill: "#7899ce", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={68}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          formatter={(value, name) => [tooltipCurrency(value), name]}
          labelFormatter={(label) => `Date : ${formatTooltipDate(label)}`}
        />
        <ReferenceLine stroke="rgba(255,255,255,.2)" y={0} />
        <Line
          dataKey="value"
          dot={false}
          name="Valeur"
          stroke="#1098f7"
          strokeWidth={2.1}
          type="monotone"
          {...CHART_SERIES_ANIMATION}
        />
        <Line
          dataKey="profit"
          dot={false}
          name="Gain / perte"
          stroke={accentColor}
          strokeWidth={2.4}
          type="monotone"
          {...CHART_SERIES_ANIMATION}
        />
        <Line
          dataKey="invested"
          dot={false}
          name="Investi"
          stroke="#f8d047"
          strokeDasharray="5 6"
          strokeWidth={2}
          type="monotone"
          {...CHART_SERIES_ANIMATION}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
