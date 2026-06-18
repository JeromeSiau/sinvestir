import { getAssetById } from "./crypto-assets";

export type PricePoint = {
  date: string;
  price: number;
};

type Profile = {
  base: number;
  trend: number;
  amplitude: number;
  phase: number;
  noise: number;
};

const PROFILES: Record<string, Profile> = {
  bitcoin: { base: 6300, trend: 0.00096, amplitude: 0.42, phase: 0.4, noise: 0.075 },
  ethereum: { base: 150, trend: 0.00125, amplitude: 0.52, phase: 1.1, noise: 0.095 },
  solana: { base: 1.1, trend: 0.0022, amplitude: 0.72, phase: 2.2, noise: 0.14 },
  binancecoin: { base: 16, trend: 0.00125, amplitude: 0.5, phase: 1.8, noise: 0.08 },
  ripple: { base: 0.28, trend: 0.0006, amplitude: 0.58, phase: 0.9, noise: 0.11 },
  cardano: { base: 0.05, trend: 0.0011, amplitude: 0.66, phase: 2.6, noise: 0.12 },
  dogecoin: { base: 0.002, trend: 0.0017, amplitude: 0.8, phase: 3.1, noise: 0.18 },
  chainlink: { base: 1.7, trend: 0.0012, amplitude: 0.58, phase: 0.2, noise: 0.1 },
  "avalanche-2": { base: 3.2, trend: 0.00145, amplitude: 0.62, phase: 2.8, noise: 0.12 },
  polkadot: { base: 2.8, trend: 0.0009, amplitude: 0.55, phase: 1.6, noise: 0.105 },
  "usd-coin": { base: 0.92, trend: 0, amplitude: 0.015, phase: 0.6, noise: 0.004 },
  tether: { base: 0.92, trend: 0, amplitude: 0.014, phase: 1.2, noise: 0.004 },
};

const DAY = 24 * 60 * 60 * 1000;
const EPOCH = Date.UTC(2020, 0, 1);

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function hashNoise(dayIndex: number, seed: number) {
  const x = Math.sin(dayIndex * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function generateFallbackPrices(assetId: string, startDate: string, endDate: string): PricePoint[] {
  const asset = getAssetById(assetId);
  const profile = PROFILES[asset.id] ?? PROFILES.bitcoin;
  const start = new Date(`${startDate}T00:00:00.000Z`).getTime();
  const end = new Date(`${endDate}T00:00:00.000Z`).getTime();
  const boundedStart = Number.isFinite(start) ? start : Date.UTC(2024, 0, 1);
  const boundedEnd = Number.isFinite(end) ? end : Date.now();
  const from = Math.min(boundedStart, boundedEnd);
  const to = Math.max(boundedStart, boundedEnd);
  const points: PricePoint[] = [];

  for (let time = from; time <= to; time += DAY) {
    const globalDay = Math.max(0, Math.floor((time - EPOCH) / DAY));
    const macroCycle = Math.sin(globalDay / 190 + profile.phase);
    const shorterCycle = Math.sin(globalDay / 43 + profile.phase * 2.1) * 0.18;
    const drift = Math.exp(profile.trend * globalDay);
    const noise = (hashNoise(globalDay, profile.phase * 1000) - 0.5) * profile.noise;
    const multiplier = 1 + macroCycle * profile.amplitude + shorterCycle + noise;
    const stableClamp = asset.stable ? 1 + (macroCycle * profile.amplitude + noise) : Math.max(0.05, multiplier);
    const price = profile.base * drift * stableClamp;

    points.push({
      date: toIsoDate(new Date(time)),
      price: Number(Math.max(0.0001, price).toFixed(asset.stable ? 4 : 2)),
    });
  }

  return points;
}
