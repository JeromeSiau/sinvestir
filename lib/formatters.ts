export function formatCurrency(value: number, decimals = 2) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    notation: "compact",
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatNumber(value: number, decimals = 6) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatChartDate(value: string | number) {
  if (typeof value === "number") {
    return new Intl.DateTimeFormat("fr-FR", {
      month: "2-digit",
      year: "2-digit",
    }).format(new Date(value));
  }

  const rawValue = String(value);
  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(rawValue) ? `${rawValue}T00:00:00.000Z` : rawValue,
  );

  if (Number.isNaN(date.getTime())) return rawValue;

  return new Intl.DateTimeFormat("fr-FR", {
    month: "2-digit",
    year: "2-digit",
  }).format(date);
}

export function formatTooltipDate(value: unknown) {
  const numeric = Number(value);

  if (Number.isFinite(numeric)) {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(numeric));
  }

  return String(value);
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

export function tooltipCurrency(value: unknown) {
  const numeric = Array.isArray(value) ? Number(value[0]) : Number(value ?? 0);
  return formatCurrency(numeric);
}

export function tooltipUnits(value: unknown, symbol: string) {
  const numeric = Array.isArray(value) ? Number(value[0]) : Number(value ?? 0);
  return `${formatNumber(numeric, 6)} ${symbol}`;
}
