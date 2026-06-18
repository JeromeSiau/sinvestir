import { formatCurrency, formatNumber, formatPercent } from "../../lib/formatters";
import type { SimulationResult } from "../../lib/simulation";

type ResultsNarrativeProps = {
  assetSymbol: string;
  simulation: SimulationResult | null;
};

export function ResultsNarrative({ assetSymbol, simulation }: ResultsNarrativeProps) {
  if (!simulation) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-sm font-light leading-7 text-white/70 sm:col-span-2 md:col-span-3">
        Ajustez les paramètres pour afficher la synthèse de votre stratégie.
      </div>
    );
  }

  const purchaseLabel = simulation.periodCount > 1 ? "achats" : "achat";
  const outcomeLabel = simulation.profit >= 0 ? "un gain latent" : "une perte latente";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-5 text-center text-sm font-light leading-7 text-white sm:col-span-2 sm:py-6 md:col-span-3 md:text-base">
      Votre stratégie a investi <strong className="font-semibold">{formatCurrency(simulation.invested)}</strong> via{" "}
      {simulation.periodCount} {purchaseLabel} pour acquérir{" "}
      <strong className="font-semibold">
        {formatNumber(simulation.units, 6)} {assetSymbol}
      </strong>
      . Au dernier prix disponible, le capital final atteint{" "}
      <strong className="font-semibold">{formatCurrency(simulation.finalValue)}</strong>, soit {outcomeLabel} de{" "}
      <strong className="font-semibold">{formatCurrency(Math.abs(simulation.profit))}</strong> et une performance de{" "}
      <strong className="font-semibold">{formatPercent(simulation.performance)} %</strong>.
    </div>
  );
}
