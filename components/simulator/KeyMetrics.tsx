import { BadgeEuro, Coins, Percent, PiggyBank } from "lucide-react";

import { formatCurrency, formatNumber, formatPercent } from "../../lib/formatters";
import type { SimulationResult } from "../../lib/simulation";
import { CapitalResultCard } from "./CapitalResultCard";
import { ResultCard } from "./ResultCard";
import { ResultsNarrative } from "./ResultsNarrative";

type KeyMetricsProps = {
  assetSymbol: string;
  simulation: SimulationResult | null;
};

export function KeyMetrics({ assetSymbol, simulation }: KeyMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      <CapitalResultCard simulation={simulation} />
      <ResultCard
        icon={<Percent size={16} />}
        label="Performance"
        value={simulation ? `${formatPercent(simulation.performance)} %` : "—"}
      />
      <ResultCard
        icon={<PiggyBank size={16} />}
        label="Investi"
        value={simulation ? formatCurrency(simulation.invested) : "—"}
      />
      <ResultCard
        icon={<Coins size={16} />}
        label="Acquis"
        value={simulation ? `${formatNumber(simulation.units, 6)} ${assetSymbol}` : "—"}
      />
      <ResultCard
        icon={<BadgeEuro size={16} />}
        label="Prix moyen d'acquisition"
        value={simulation ? formatCurrency(simulation.averagePrice) : "—"}
      />
      <ResultsNarrative assetSymbol={assetSymbol} simulation={simulation} />
    </div>
  );
}
