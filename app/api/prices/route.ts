import { NextResponse } from "next/server";

import { getAssetById } from "../../../lib/crypto-assets";
import { generateFallbackPrices, type PricePoint } from "../../../lib/fallback-prices";

export const runtime = "nodejs";
export const revalidate = 3600;

const COINBASE_BASE_URL = "https://api.exchange.coinbase.com";
const DAY_MS = 24 * 60 * 60 * 1000;
const COINBASE_CHUNK_DAYS = 299;

function isIsoDate(value: string | null) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function toIsoDateFromMs(value: number) {
  return new Date(value).toISOString().slice(0, 10);
}

async function fetchCoinbasePrices(symbol: string, start: string, end: string): Promise<PricePoint[]> {
  const byDate = new Map<string, number>();
  const product = `${symbol.toUpperCase()}-EUR`;
  let cursor = new Date(`${start}T00:00:00.000Z`).getTime();
  const endMs = new Date(`${end}T00:00:00.000Z`).getTime();

  while (cursor <= endMs) {
    // Coinbase limits the daily candle window, so long backtests are fetched in safe chunks.
    const chunkEnd = Math.min(cursor + DAY_MS * COINBASE_CHUNK_DAYS, endMs);
    const url = new URL(`${COINBASE_BASE_URL}/products/${product}/candles`);
    url.searchParams.set("granularity", "86400");
    url.searchParams.set("start", new Date(cursor).toISOString());
    url.searchParams.set("end", new Date(chunkEnd).toISOString());

    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "sinvestir-crypto-simulator/0.1",
      },
      next: { revalidate },
    });

    if (!response.ok) {
      throw new Error(`Coinbase responded with ${response.status}`);
    }

    const payload = (await response.json()) as unknown;
    if (!Array.isArray(payload)) {
      throw new Error("Coinbase returned an invalid payload");
    }

    for (const candle of payload) {
      if (!Array.isArray(candle)) continue;
      const [timestamp, , , , close] = candle;
      const price = Number(close);
      if (!Number.isFinite(timestamp) || !Number.isFinite(price) || price <= 0) continue;
      byDate.set(toIsoDateFromMs(Number(timestamp) * 1000), Number(price.toFixed(price < 1 ? 6 : 2)));
    }

    cursor = chunkEnd + DAY_MS;
  }

  const prices = Array.from(byDate.entries())
    .map(([date, price]) => ({ date, price }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (prices.length < 2) {
    throw new Error("Coinbase returned too few price points");
  }

  return prices;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asset = getAssetById(searchParams.get("asset") ?? "bitcoin");
  const today = new Date();
  const defaultEnd = today.toISOString().slice(0, 10);
  const defaultStart = new Date(today.getTime() - DAY_MS * 365 * 2).toISOString().slice(0, 10);
  const start = isIsoDate(searchParams.get("start")) ? searchParams.get("start")! : defaultStart;
  const end = isIsoDate(searchParams.get("end")) ? searchParams.get("end")! : defaultEnd;
  const normalizedStart = start <= end ? start : end;
  const normalizedEnd = start <= end ? end : start;

  try {
    const prices = await fetchCoinbasePrices(asset.symbol, normalizedStart, normalizedEnd);
    return NextResponse.json({
      source: "coinbase",
      asset,
      prices,
      asOf: new Date().toISOString(),
    });
  } catch (coinbaseError) {
    return NextResponse.json(
      {
        source: "fallback",
        asset,
        prices: generateFallbackPrices(asset.id, normalizedStart, normalizedEnd),
        asOf: new Date().toISOString(),
        note: coinbaseError instanceof Error ? coinbaseError.message : "Coinbase failed",
      },
      {
        headers: {
          "x-sinvestir-data-source": "fallback",
        },
      },
    );
  }
}
