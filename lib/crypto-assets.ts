export type CryptoAsset = {
  id: string;
  symbol: string;
  name: string;
  accent: string;
  stable?: boolean;
};

export const CRYPTO_ASSETS: CryptoAsset[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", accent: "#f7931a" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", accent: "#8a92b2" },
  { id: "solana", symbol: "SOL", name: "Solana", accent: "#14f195" },
  { id: "binancecoin", symbol: "BNB", name: "BNB", accent: "#f3ba2f" },
  { id: "ripple", symbol: "XRP", name: "XRP", accent: "#63a6ff" },
  { id: "cardano", symbol: "ADA", name: "Cardano", accent: "#3468d1" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", accent: "#c2a633" },
  { id: "chainlink", symbol: "LINK", name: "Chainlink", accent: "#2a5ada" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche", accent: "#e84142" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot", accent: "#e6007a" },
  { id: "usd-coin", symbol: "USDC", name: "USDC", accent: "#2775ca", stable: true },
  { id: "tether", symbol: "USDT", name: "Tether", accent: "#26a17b", stable: true },
];

export function getAssetById(id: string) {
  return CRYPTO_ASSETS.find((asset) => asset.id === id) ?? CRYPTO_ASSETS[0];
}
