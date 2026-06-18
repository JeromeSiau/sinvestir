import type { PricePoint } from "./fallback-prices";

export type Frequency = "once" | "day" | "week" | "month";

export type SimulationInput = {
  amount: number;
  frequency: Frequency;
  startDate: string;
  endDate: string;
  prices: PricePoint[];
};

export type Contribution = {
  date: string;
  amount: number;
  price: number;
  units: number;
};

export type ChartPoint = {
  date: string;
  invested: number;
  value: number;
  price: number;
  averagePrice: number;
  units: number;
};

export type SimulationResult = {
  invested: number;
  units: number;
  averagePrice: number;
  finalPrice: number;
  finalValue: number;
  profit: number;
  performance: number;
  periodCount: number;
  periodLabel: string;
  contributions: Contribution[];
  chart: ChartPoint[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

const FREQUENCY_LABEL: Record<Frequency, { singular: string; plural: string }> = {
  once: { singular: "fois", plural: "fois" },
  day: { singular: "jour", plural: "jours" },
  week: { singular: "semaine", plural: "semaines" },
  month: { singular: "mois", plural: "mois" },
};

function asUtcDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addMonth(date: Date) {
  const next = new Date(date.getTime());
  const originalDay = next.getUTCDate();
  next.setUTCMonth(next.getUTCMonth() + 1);
  if (next.getUTCDate() < originalDay) {
    next.setUTCDate(0);
  }
  return next;
}

function sanitizePrices(prices: PricePoint[]) {
  return prices
    .filter((point) => Number.isFinite(point.price) && point.price > 0 && point.date)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function findPriceAtOrBefore(prices: PricePoint[], date: string) {
  let match = prices[0];
  for (const point of prices) {
    if (point.date > date) break;
    match = point;
  }
  // Contributions can fall on missing quote dates; use the latest known price to keep DCA deterministic.
  return match;
}

function buildContributionDates(frequency: Frequency, startDate: string, endDate: string) {
  const dates: string[] = [];
  let cursor = asUtcDate(startDate);
  const end = asUtcDate(endDate);

  while (cursor.getTime() <= end.getTime()) {
    dates.push(toIsoDate(cursor));
    if (frequency === "once") break;
    if (frequency === "day") cursor = new Date(cursor.getTime() + DAY_MS);
    if (frequency === "week") cursor = new Date(cursor.getTime() + DAY_MS * 7);
    if (frequency === "month") cursor = addMonth(cursor);
  }

  return dates;
}

function periodLabel(frequency: Frequency, count: number) {
  const label = FREQUENCY_LABEL[frequency];
  return count <= 1 ? label.singular : label.plural;
}

export function simulateCryptoInvestment(input: SimulationInput): SimulationResult {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Le montant doit etre superieur a zero.");
  }

  const prices = sanitizePrices(input.prices);
  if (prices.length === 0) {
    throw new Error("Aucune donnee de prix exploitable.");
  }

  const startDate = input.startDate <= input.endDate ? input.startDate : input.endDate;
  const endDate = input.startDate <= input.endDate ? input.endDate : input.startDate;
  const contributionDates = buildContributionDates(input.frequency, startDate, endDate);
  const contributions = contributionDates.map((date) => {
    const price = findPriceAtOrBefore(prices, date).price;
    return {
      date,
      amount: input.amount,
      price,
      units: input.amount / price,
    };
  });

  const finalPrice = findPriceAtOrBefore(prices, endDate).price;
  const invested = contributions.reduce((sum, contribution) => sum + contribution.amount, 0);
  const units = contributions.reduce((sum, contribution) => sum + contribution.units, 0);
  const averagePrice = units > 0 ? invested / units : 0;
  const finalValue = units * finalPrice;
  const profit = finalValue - invested;
  const performance = invested > 0 ? (profit / invested) * 100 : 0;

  let contributionIndex = 0;
  let runningInvested = 0;
  let runningUnits = 0;
  const chart = prices
    .filter((point) => point.date >= startDate && point.date <= endDate)
    .map((point) => {
      while (contributionIndex < contributions.length && contributions[contributionIndex].date <= point.date) {
        runningInvested += contributions[contributionIndex].amount;
        runningUnits += contributions[contributionIndex].units;
        contributionIndex += 1;
      }

      return {
        date: point.date,
        invested: runningInvested,
        value: runningUnits * point.price,
        price: point.price,
        averagePrice: runningUnits > 0 ? runningInvested / runningUnits : 0,
        units: runningUnits,
      };
    });

  return {
    invested,
    units,
    averagePrice,
    finalPrice,
    finalValue,
    profit,
    performance,
    periodCount: contributions.length,
    periodLabel: periodLabel(input.frequency, contributions.length),
    contributions,
    chart,
  };
}
