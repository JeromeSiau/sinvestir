type EmptyChartProps = {
  loading: boolean;
};

export function EmptyChart({ loading }: EmptyChartProps) {
  return (
    <div className="grid h-full place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-sm font-light text-white/50">
      {loading ? "Chargement des données..." : "Données indisponibles"}
    </div>
  );
}
