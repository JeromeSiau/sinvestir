import { CryptoSimulator } from "../../components/CryptoSimulator";

export default function EmbedPage() {
  return (
    <main className="min-h-dvh bg-[linear-gradient(126.82deg,_#000519_28.59%,_#000000_100%)] p-4 text-white sm:p-6">
      <div className="mx-auto max-w-6xl">
        <CryptoSimulator compact />
      </div>
    </main>
  );
}
