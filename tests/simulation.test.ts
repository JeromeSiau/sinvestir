import { describe, expect, it } from "vitest";

import { getChartTicks, getChartViewport, getVisibleChartPoints, toChartPoints } from "../lib/chart-utils";
import { simulateCryptoInvestment } from "../lib/simulation";

const flatPrices = [
  { date: "2024-01-01", price: 100 },
  { date: "2024-01-02", price: 100 },
  { date: "2024-01-03", price: 100 },
  { date: "2024-01-04", price: 100 },
];

describe("simulateCryptoInvestment", () => {
  it("calculates a one-shot investment", () => {
    const result = simulateCryptoInvestment({
      amount: 100,
      frequency: "once",
      startDate: "2024-01-01",
      endDate: "2024-01-04",
      prices: [
        { date: "2024-01-01", price: 100 },
        { date: "2024-01-04", price: 150 },
      ],
    });

    expect(result.periodCount).toBe(1);
    expect(result.invested).toBe(100);
    expect(result.units).toBe(1);
    expect(result.finalValue).toBe(150);
    expect(result.performance).toBe(50);
  });

  it("builds daily DCA contributions inside the selected period", () => {
    const result = simulateCryptoInvestment({
      amount: 25,
      frequency: "day",
      startDate: "2024-01-01",
      endDate: "2024-01-04",
      prices: flatPrices,
    });

    expect(result.periodCount).toBe(4);
    expect(result.invested).toBe(100);
    expect(result.units).toBe(1);
    expect(result.finalValue).toBe(100);
    expect(result.performance).toBe(0);
  });

  it("uses the latest known price when a contribution date has no direct quote", () => {
    const result = simulateCryptoInvestment({
      amount: 100,
      frequency: "week",
      startDate: "2024-01-01",
      endDate: "2024-01-15",
      prices: [
        { date: "2024-01-01", price: 100 },
        { date: "2024-01-10", price: 200 },
        { date: "2024-01-16", price: 300 },
      ],
    });

    expect(result.periodCount).toBe(3);
    expect(result.contributions.map((item) => item.price)).toEqual([100, 100, 200]);
    expect(result.finalValue).toBeCloseTo(500);
  });

  it("calculates average acquisition price, final capital and performance", () => {
    const result = simulateCryptoInvestment({
      amount: 100,
      frequency: "month",
      startDate: "2024-01-01",
      endDate: "2024-03-01",
      prices: [
        { date: "2024-01-01", price: 100 },
        { date: "2024-02-01", price: 50 },
        { date: "2024-03-01", price: 200 },
      ],
    });

    expect(result.invested).toBe(300);
    expect(result.units).toBeCloseTo(3.5);
    expect(result.averagePrice).toBeCloseTo(85.714285);
    expect(result.finalValue).toBeCloseTo(700);
    expect(result.performance).toBeCloseTo(133.333333);
  });

  it("normalizes reversed date inputs", () => {
    const result = simulateCryptoInvestment({
      amount: 100,
      frequency: "day",
      startDate: "2024-01-04",
      endDate: "2024-01-01",
      prices: flatPrices,
    });

    expect(result.periodCount).toBe(4);
    expect(result.invested).toBe(400);
  });
});

describe("chart helpers", () => {
  const chartPoints = toChartPoints(
    Array.from({ length: 10 }, (_, index) => {
      const day = String(index + 1).padStart(2, "0");
      const invested = (index + 1) * 100;

      return {
        date: `2024-01-${day}`,
        invested,
        value: invested * 1.2,
        price: 120 + index,
        averagePrice: 100,
        units: index + 1,
      };
    }),
  );

  it("selects visible chart points from percentage bounds", () => {
    const visible = getVisibleChartPoints(chartPoints, { start: 20, end: 60 });

    expect(visible.map((point) => point.date)).toEqual([
      "2024-01-02",
      "2024-01-03",
      "2024-01-04",
      "2024-01-05",
      "2024-01-06",
      "2024-01-07",
    ]);
  });

  it("keeps the last chart tick", () => {
    const ticks = getChartTicks(chartPoints);

    expect(ticks.at(-1)).toBe(chartPoints.at(-1)?.timestamp);
  });

  it("builds a chart viewport with visible points and ticks", () => {
    const viewport = getChartViewport(chartPoints, { start: 20, end: 60 });

    expect(viewport.hasVisibleData).toBe(true);
    expect(viewport.points.at(0)?.date).toBe("2024-01-02");
    expect(viewport.ticks.at(-1)).toBe(viewport.points.at(-1)?.timestamp);
  });
});
