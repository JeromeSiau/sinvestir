import { formatCurrency, formatDate, formatNumber } from "../../lib/formatters";

export type CalendarRow = {
  amount: number;
  date: string;
  index: number;
  price: number;
  units: number;
  valueAtBuyDate: number;
};

type CalendarTableProps = {
  assetSymbol: string;
  rows: CalendarRow[];
};

const MAX_VISIBLE_ROWS = 120;

export function CalendarTable({ assetSymbol, rows }: CalendarTableProps) {
  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="min-w-[840px] w-full border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr className="bg-violet-blue text-white">
              <th className="rounded-l-sm px-5 py-4 text-left font-normal">#</th>
              <th className="px-5 py-4 text-left font-normal">Date</th>
              <th className="px-5 py-4 text-right font-normal">Versement</th>
              <th className="px-5 py-4 text-right font-normal">Prix d'achat</th>
              <th className="px-5 py-4 text-right font-normal">Quantité cumulée</th>
              <th className="rounded-r-sm px-5 py-4 text-right font-normal">Capital à date</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, MAX_VISIBLE_ROWS).map((row) => (
              <tr key={`${row.index}-${row.date}`} className={row.index % 2 === 0 ? "bg-[#123050]" : "bg-white/[0.02]"}>
                <td className="px-5 py-3 text-white/70">{row.index}</td>
                <td className="px-5 py-3 text-white">{formatDate(row.date)}</td>
                <td className="px-5 py-3 text-right text-white">{formatCurrency(row.amount)}</td>
                <td className="px-5 py-3 text-right text-white">{formatCurrency(row.price)}</td>
                <td className="px-5 py-3 text-right text-white">
                  {formatNumber(row.units, 6)} {assetSymbol}
                </td>
                <td className="px-5 py-3 text-right text-white">{formatCurrency(row.valueAtBuyDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > MAX_VISIBLE_ROWS ? (
        <p className="mt-3 text-center text-xs font-light text-blue-light">
          Affichage limité aux 120 premiers achats pour garder la démo lisible.
        </p>
      ) : null}
    </div>
  );
}
