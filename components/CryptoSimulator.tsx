"use client";

import { Info } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getRangeLabel as getChartRangeLabel,
  getChartViewport,
  toChartPoints,
  type ChartRange,
} from "../lib/chart-utils";
import { getAssetById } from "../lib/crypto-assets";
import type { PricePoint } from "../lib/fallback-prices";
import { type Frequency, simulateCryptoInvestment } from "../lib/simulation";
import { CalendarTable, type CalendarRow } from "./simulator/CalendarTable";
import { ChartCard } from "./simulator/ChartCard";
import { ChartTabs, type ChartTab } from "./simulator/ChartTabs";
import { EmptyChart } from "./simulator/EmptyChart";
import { HistoryChart } from "./simulator/HistoryChart";
import { KeyMetrics } from "./simulator/KeyMetrics";
import { ProfitChart } from "./simulator/ProfitChart";
import { SimulationForm } from "./simulator/SimulationForm";

type PriceResponse = {
  asOf: string;
  prices: PricePoint[];
  source: "coinbase" | "fallback";
};

type SimulatorProps = {
  compact?: boolean;
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

const DEFAULTS: {
  amount: number;
  assetId: string;
  endDate: string;
  frequency: Frequency;
  startDate: string;
} = {
  amount: 25,
  assetId: "bitcoin",
  endDate: todayIsoDate(),
  frequency: "week",
  startDate: "2018-01-01",
};

function createFullChartRange(): ChartRange {
  return { start: 0, end: 100 };
}

function getChartAnimationKey(prefix: string, range: ChartRange, signature: string) {
  return [prefix, range.start, range.end, signature].join("-");
}

function getPriceSourceLabel(source: PriceResponse["source"]) {
  if (source === "coinbase") return "Coinbase";
  return "données de secours";
}

export function CryptoSimulator({ compact = false }: SimulatorProps) {
  const [assetId, setAssetId] = useState(DEFAULTS.assetId);
  const [amount, setAmount] = useState(DEFAULTS.amount);
  const [frequency, setFrequency] = useState<Frequency>(DEFAULTS.frequency);
  const [startDate, setStartDate] = useState(DEFAULTS.startDate);
  const [endDate, setEndDate] = useState(DEFAULTS.endDate);
  const [prices, setPrices] = useState<PricePoint[]>([]);
  const [priceSource, setPriceSource] = useState<PriceResponse["source"]>("fallback");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [activeTab, setActiveTab] = useState<ChartTab>("graphs");
  const [historyRange, setHistoryRange] = useState<ChartRange>(createFullChartRange);
  const [profitRange, setProfitRange] = useState<ChartRange>(createFullChartRange);

  const asset = getAssetById(assetId);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      asset: assetId,
      end: endDate,
      start: startDate,
    });

    setLoading(true);
    setFetchError("");

    fetch(`/api/prices?${params.toString()}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Impossible de charger les prix.");
        return response.json() as Promise<PriceResponse>;
      })
      .then((payload) => {
        setPrices(payload.prices);
        setPriceSource(payload.source);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFetchError(error instanceof Error ? error.message : "Erreur inattendue.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [assetId, endDate, startDate]);

  const simulation = useMemo(() => {
    if (prices.length < 2) return null;
    try {
      return simulateCryptoInvestment({ amount, endDate, frequency, prices, startDate });
    } catch {
      return null;
    }
  }, [amount, endDate, frequency, prices, startDate]);

  const calendarRows = useMemo<CalendarRow[]>(() => {
    if (!simulation) return [];

    let cumulativeUnits = 0;

    return simulation.contributions.map((contribution, index) => {
      cumulativeUnits += contribution.units;
      return {
        amount: contribution.amount,
        date: contribution.date,
        index: index + 1,
        price: contribution.price,
        units: cumulativeUnits,
        valueAtBuyDate: cumulativeUnits * contribution.price,
      };
    });
  }, [simulation]);

  const chartPoints = useMemo(() => toChartPoints(simulation?.chart ?? []), [simulation]);
  const historyViewport = useMemo(() => getChartViewport(chartPoints, historyRange), [chartPoints, historyRange]);
  const profitViewport = useMemo(() => getChartViewport(chartPoints, profitRange), [chartPoints, profitRange]);
  const hasChartData = chartPoints.length > 1;
  const chartAnimationSignature = useMemo(
    () => [assetId, amount, frequency, startDate, endDate, chartPoints.length].join("|"),
    [amount, assetId, chartPoints.length, endDate, frequency, startDate],
  );
  const getRangeLabel = useCallback((value: number) => {
    return getChartRangeLabel(chartPoints, value, startDate, endDate);
  }, [chartPoints, endDate, startDate]);

  return (
    <div className={compact ? "max-w-6xl space-y-10" : "space-y-10"}>
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-5">
        <section className="flex flex-col gap-8 md:col-span-2">
          {!compact ? (
            <h3 className="border-l-2 border-blue-sky px-4 py-0.5 text-2xl font-normal text-white">
              Simulation
            </h3>
          ) : null}

          <SimulationForm
            amount={amount}
            assetId={assetId}
            endDate={endDate}
            frequency={frequency}
            startDate={startDate}
            onAmountChange={setAmount}
            onAssetChange={setAssetId}
            onEndDateChange={setEndDate}
            onFrequencyChange={setFrequency}
            onStartDateChange={setStartDate}
          />
        </section>

        <section className="space-y-6 md:col-span-3">
          {!compact ? (
            <div className="flex items-center justify-between gap-4">
              <h3 className="border-l-2 border-blue-sky px-4 py-0.5 text-2xl font-normal text-white">Chiffres clés</h3>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-sky/10 bg-blue-sky/5 px-4 py-2 text-xs font-light text-blue-light">
                <Info size={14} />
                {getPriceSourceLabel(priceSource)}
              </span>
            </div>
          ) : null}

          <KeyMetrics assetSymbol={asset.symbol} simulation={simulation} />
        </section>
      </div>

      <section className="space-y-8">
        <ChartTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "graphs" ? (
          <div className="space-y-6">
            <ChartCard
              badgeClassName="rounded-full bg-blue-sky/10 px-3 py-1 text-xs font-light text-blue-sky"
              badgeLabel="DCA"
              dateScaleRightPaddingClassName="pr-[52px]"
              getRangeLabel={getRangeLabel}
              hasData={hasChartData}
              legend={[
                { color: "#1098f7", label: "Capital" },
                { color: "#f8d047", label: "Investi" },
                { color: "#8fd3ff", label: "Acquis" },
              ]}
              overline="Graphe 1"
              range={historyRange}
              ticks={historyViewport.ticks}
              title="Historique"
              onRangeCommit={setHistoryRange}
            >
              {historyViewport.hasVisibleData ? (
                <HistoryChart
                  animationKey={getChartAnimationKey("history", historyRange, chartAnimationSignature)}
                  assetSymbol={asset.symbol}
                  points={historyViewport.points}
                  ticks={historyViewport.ticks}
                />
              ) : (
                <EmptyChart loading={loading} />
              )}
            </ChartCard>

            <ChartCard
              badgeClassName="rounded-full bg-yellow/10 px-3 py-1 text-xs font-light text-yellow"
              badgeLabel="P&L"
              getRangeLabel={getRangeLabel}
              hasData={hasChartData}
              legend={[
                { color: "#1098f7", label: "Valeur" },
                { color: asset.accent, label: "Gain / perte" },
                { color: "#f8d047", label: "Investi" },
              ]}
              overline="Graphe 2"
              range={profitRange}
              ticks={profitViewport.ticks}
              title="Gains / Pertes"
              onRangeCommit={setProfitRange}
            >
              {profitViewport.hasVisibleData ? (
                <ProfitChart
                  accentColor={asset.accent}
                  animationKey={getChartAnimationKey("profit", profitRange, chartAnimationSignature)}
                  points={profitViewport.points}
                  ticks={profitViewport.ticks}
                />
              ) : (
                <EmptyChart loading={loading} />
              )}
            </ChartCard>
          </div>
        ) : (
          <CalendarTable assetSymbol={asset.symbol} rows={calendarRows} />
        )}
      </section>

      {fetchError ? (
        <p className="rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm font-light text-red-100">
          {fetchError}
        </p>
      ) : null}
    </div>
  );
}
