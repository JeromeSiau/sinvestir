import { CalendarDays, ChevronDown } from "lucide-react";

import { cx } from "../../lib/classnames";
import { CRYPTO_ASSETS } from "../../lib/crypto-assets";
import type { Frequency } from "../../lib/simulation";
import { FieldLabel } from "./FieldLabel";

const FREQUENCIES: { label: string; value: Frequency }[] = [
  { value: "once", label: "Une fois" },
  { value: "day", label: "Quotidien" },
  { value: "week", label: "Hebdomadaire" },
  { value: "month", label: "Mensuel" },
];

const FIELD_CONTROL_CLASS =
  "w-full border-0 border-b border-blue-light/30 bg-transparent px-0 pb-2 text-xl font-light text-white outline-none transition-colors focus:border-blue-light focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50";
const SELECT_CONTROL_CLASS = cx(FIELD_CONTROL_CLASS, "appearance-none pr-8");
const DATE_CONTROL_CLASS = cx(FIELD_CONTROL_CLASS, "pl-8");

type SimulationFormProps = {
  amount: number;
  assetId: string;
  endDate: string;
  frequency: Frequency;
  startDate: string;
  onAmountChange: (amount: number) => void;
  onAssetChange: (assetId: string) => void;
  onEndDateChange: (date: string) => void;
  onFrequencyChange: (frequency: Frequency) => void;
  onStartDateChange: (date: string) => void;
};

function isFrequency(value: string): value is Frequency {
  return FREQUENCIES.some((item) => item.value === value);
}

function toFrequency(value: string): Frequency {
  return isFrequency(value) ? value : "week";
}

export function SimulationForm({
  amount,
  assetId,
  endDate,
  frequency,
  startDate,
  onAmountChange,
  onAssetChange,
  onEndDateChange,
  onFrequencyChange,
  onStartDateChange,
}: SimulationFormProps) {
  return (
    <form className="space-y-6 sm:space-y-10">
      <FieldLabel label="Actif numérique">
        <div className="relative">
          <select
            className={SELECT_CONTROL_CLASS}
            value={assetId}
            onChange={(event) => onAssetChange(event.target.value)}
          >
            {CRYPTO_ASSETS.map((cryptoAsset) => (
              <option key={cryptoAsset.id} className="bg-blue-night text-white" value={cryptoAsset.id}>
                {cryptoAsset.name} ({cryptoAsset.symbol})
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 top-2 h-5 w-5 text-blue-light" />
        </div>
      </FieldLabel>

      <FieldLabel label="Montant investi" unit="EUR">
        <input
          className={FIELD_CONTROL_CLASS}
          inputMode="decimal"
          min="1"
          step="10"
          type="number"
          value={amount}
          onChange={(event) => onAmountChange(Number(event.target.value))}
        />
      </FieldLabel>

      <FieldLabel label="Fréquence">
        <div className="relative">
          <select
            className={SELECT_CONTROL_CLASS}
            value={frequency}
            onChange={(event) => onFrequencyChange(toFrequency(event.target.value))}
          >
            {FREQUENCIES.map((item) => (
              <option key={item.value} className="bg-blue-night text-white" value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 top-2 h-5 w-5 text-blue-light" />
        </div>
      </FieldLabel>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
        <FieldLabel label="Depuis">
          <div className="relative">
            <CalendarDays className="absolute left-0 top-2 h-5 w-5 text-blue-light" />
            <input
              className={DATE_CONTROL_CLASS}
              type="date"
              value={startDate}
              onChange={(event) => onStartDateChange(event.target.value)}
            />
          </div>
        </FieldLabel>
        <FieldLabel label="Jusqu'au">
          <div className="relative">
            <CalendarDays className="absolute left-0 top-2 h-5 w-5 text-blue-light" />
            <input
              className={DATE_CONTROL_CLASS}
              type="date"
              value={endDate}
              onChange={(event) => onEndDateChange(event.target.value)}
            />
          </div>
        </FieldLabel>
      </div>
    </form>
  );
}
