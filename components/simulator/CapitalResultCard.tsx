import { CircleDollarSign } from "lucide-react";

import { formatCurrency, formatEuroAmount } from "../../lib/formatters";
import type { SimulationResult } from "../../lib/simulation";

type CapitalResultCardProps = {
  simulation: SimulationResult | null;
};

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function CapitalResultCard({ simulation }: CapitalResultCardProps) {
  const hasSimulation = Boolean(simulation);
  const isGain = (simulation?.profit ?? 0) >= 0;
  const totalForBar = simulation ? (isGain ? simulation.finalValue : simulation.invested) : 0;
  const primaryBarShare =
    simulation && totalForBar > 0
      ? clampPercent(((isGain ? simulation.invested : simulation.finalValue) / totalForBar) * 100)
      : 0;
  const secondaryBarShare = hasSimulation ? 100 - primaryBarShare : 0;
  const primaryLabel = isGain ? "Somme investie" : "Capital actuel";
  const secondaryLabel = isGain ? "Gain latent" : "Perte latente";
  const primaryValue = simulation ? (isGain ? simulation.invested : simulation.finalValue) : 0;
  const secondaryValue = Math.abs(simulation?.profit ?? 0);

  return (
    <div className="relative flex min-h-[158px] flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5 sm:col-span-2 sm:min-h-[176px]">
      <div>
        <p className="flex items-center gap-2 text-sm font-normal text-white">
          Capital final
          <span className="text-blue-light">
            <CircleDollarSign size={16} />
          </span>
        </p>

        <div className="mt-3 flex flex-wrap items-end gap-x-2 gap-y-1">
          <p className="font-display text-[2.35rem] font-normal leading-none tracking-normal text-white sm:text-4xl md:text-[2.7rem]">
            {simulation ? formatEuroAmount(simulation.finalValue) : "—"}
          </p>
          {simulation ? <span className="pb-1 text-lg font-light text-white">EUR</span> : null}
        </div>
      </div>

      <div>
        <div className="mt-4 grid gap-3 text-sm sm:mt-5 sm:grid-cols-2">
          <p className="text-blue-sky">
            {primaryLabel}
            <span className="mt-1 block font-semibold text-blue-sky">
              {hasSimulation ? formatCurrency(primaryValue) : "—"}
            </span>
          </p>
          <p className={isGain ? "text-yellow" : "text-red-100"}>
            {secondaryLabel}
            <span className="mt-1 block font-semibold">
              {hasSimulation ? formatCurrency(secondaryValue) : "—"}
            </span>
          </p>
        </div>

        <div className="mt-4 flex h-3.5 overflow-hidden rounded-full bg-white/10 sm:h-4" aria-hidden="true">
          <span className="h-full bg-blue-sky" style={{ width: `${primaryBarShare}%` }} />
          <span
            className={isGain ? "h-full bg-yellow" : "h-full bg-red-300"}
            style={{ width: `${secondaryBarShare}%` }}
          />
        </div>
      </div>
    </div>
  );
}
